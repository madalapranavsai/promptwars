import express from "express";
import path from "path";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import { buildFullResponse, incidentHistory } from "./src/server/responseBuilder";
import { runDecisionEngineTests } from "./src/server/diagnosticsRunner";

// Load environment variables
dotenv.config();

export async function createExpressApp() {
  const app = express();

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  app.use(compression());
  app.use(express.json());

  // Rate Limiting for API calls to prevent abuse
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Capped to 10 req/min per IP as per Security recommendations
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again after 1 minute." }
  });

  // API Endpoints
  app.post("/api/analyze", apiLimiter, async (req, res) => {
    try {
      const { situation, role, zone, urgencyOverride, targetLanguage } = req.body;

      // 1. Validation
      if (situation === undefined || situation === null) {
        return res.status(400).json({ error: "Situation description is required." });
      }

      if (typeof situation !== "string" || situation.trim().length === 0) {
        return res.status(400).json({ error: "Situation description cannot be empty." });
      }

      if (situation.length > 2000) {
        return res.status(400).json({ error: "Situation description must be under 2000 characters." });
      }

      // 2. Perform the orchestration pipeline
      const bypassAI = req.headers["x-bypass-ai"] === "true" || process.env.VITEST !== undefined;
      const responseData = await buildFullResponse(situation, {
        role,
        zone,
        urgencyOverride,
        targetLanguage
      }, bypassAI);

      return res.json(responseData);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Analysis route error:", err);
      return res.status(500).json({
        error: "Internal server error during context and decision orchestration.",
        details: err.message
      });
    }
  });

  app.get("/api/test-results", async (req, res) => {
    try {
      const results = await runDecisionEngineTests();
      return res.json({
        success: true,
        results
      });
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });

  app.get("/api/incidents", (req, res) => {
    return res.json({
      success: true,
      incidents: incidentHistory
    });
  });

  return app;
}

const PORT = 3000;

async function startServer() {
  const app = await createExpressApp();

  // Framework-specific static content & Vite HMR middleware integration
  if (process.env.NODE_ENV !== "production" && !process.env.VITEST) {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === "production") {
    console.log("Starting server in PRODUCTION mode.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: "1d",
      etag: true
    }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VITEST) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`StadiumSense AI Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

if (!process.env.VITEST) {
  startServer().catch((err) => {
    console.error("Failed to start the StadiumSense AI server:", err);
  });
}
