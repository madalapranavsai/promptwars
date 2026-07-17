import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createExpressApp } from "../../server";

let app: any;

beforeAll(async () => {
  app = await createExpressApp();
});

describe("StadiumSense AI - Express API E2E Endpoints", () => {
  describe("POST /api/analyze", () => {
    it("should successfully orchestrate valid reports", async () => {
      const res = await request(app)
        .post("/api/analyze")
        .send({
          situation: "Active fight near sector 102.",
          role: "volunteer_steward",
          zone: "concourse_l1"
        });

      expect(res.status).toBe(200);
      expect(res.body.analysis).toBeDefined();
      expect(res.body.decision).toBeDefined();
      expect(res.body.aiOutput).toBeDefined();
      expect(res.body.analysis.category).toBe("SECURITY");
      expect(res.body.analysis.riskLevel).toBe("EMERGENCY");
      expect(res.body.decision.escalationRequired).toBe(true);
    });

    it("should return 400 Bad Request if description is empty or missing", async () => {
      const res1 = await request(app)
        .post("/api/analyze")
        .send({
          situation: ""
        });
      expect(res1.status).toBe(400);
      expect(res1.body.error).toContain("cannot be empty");

      const res2 = await request(app)
        .post("/api/analyze")
        .send({});
      expect(res2.status).toBe(400);
      expect(res2.body.error).toContain("is required");
    });

    it("should return 400 Bad Request if description length exceeds 2000 chars", async () => {
      const extremelyLongInput = "a".repeat(2001);
      const res = await request(app)
        .post("/api/analyze")
        .send({
          situation: extremelyLongInput
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("under 2000 characters");
    });

    it("should return 400 Bad Request for malformed JSON request bodies", async () => {
      // Sending raw text header but sending malformed content
      const res = await request(app)
        .post("/api/analyze")
        .set("Content-Type", "application/json")
        .send("{ malformed json ... }");
      
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/incidents", () => {
    it("should return the list of logged incidents", async () => {
      // First trigger an incident analysis
      await request(app)
        .post("/api/analyze")
        .send({
          situation: "Spectator fainted in standalone seats."
        });

      const res = await request(app).get("/api/incidents");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.incidents)).toBe(true);
      expect(res.body.incidents.length).toBeGreaterThan(0);
      
      const lastIncident = res.body.incidents[res.body.incidents.length - 1];
      expect(lastIncident.situation).toBe("Spectator fainted in standalone seats.");
      expect(lastIncident.category).toBe("MEDICAL");
    });
  });
});
