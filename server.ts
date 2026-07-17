import express from "express";
import path from "path";
import dotenv from "dotenv";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import { buildFullResponse } from "./src/server/responseBuilder";
import { runDecisionEngineTests } from "./src/server/decisionEngine.test";

// Load environment variables
dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware
  app.use(compression());
  app.use(express.json());

  // API Endpoints
  app.post("/api/analyze", async (req, res) => {
    try {
      const { situation, role, zone, urgencyOverride, targetLanguage } = req.body;

      // 1. Validation
      if (!situation || typeof situation !== "string") {
        return res.status(400).json({ error: "Situation description is required." });
      }

      if (situation.trim().length === 0) {
        return res.status(400).json({ error: "Situation description cannot be empty." });
      }

      if (situation.length > 2000) {
        return res.status(400).json({ error: "Situation description must be under 2000 characters." });
      }

      // 2. Perform the orchestration pipeline
      const responseData = await buildFullResponse(situation, {
        role,
        zone,
        urgencyOverride,
        targetLanguage
      });

      return res.json(responseData);
    } catch (error: any) {
      console.error("Analysis route error:", error);
      return res.status(500).json({
        error: "Internal server error during context and decision orchestration.",
        details: error.message
      });
    }
  });

  app.get("/api/test-results", (req, res) => {
    try {
      const results = runDecisionEngineTests();
      return res.json({
        success: true,
        results
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Framework-specific static content & Vite HMR middleware integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StadiumSense AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start the StadiumSense AI server:", err);
});
