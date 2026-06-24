import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkDbConnection, seedDatabase } from "./db";
import authRouter from "./routes/auth";
import explorerRouter from "./routes/explorer";
import predictorRouter from "./routes/predictor";
import aiRouter from "./routes/ai";
import adminRouter from "./routes/admin";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Enable CORS for frontend client interactions
app.use(cors());
app.use(express.json());

// Load API endpoints
// Support both /api/* and legacy root-level paths for Railway/frontend compatibility
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);
app.use("/api", explorerRouter);
app.use("/", explorerRouter);
app.use("/api/predictor", predictorRouter);
app.use("/predictor", predictorRouter);
app.use("/api/ai", aiRouter);
app.use("/ai", aiRouter);
app.use("/api/admin", adminRouter);
app.use("/admin", adminRouter);

// Root endpoint for Railway / default deployment checks
app.get("/", (req, res) => {
  res.json({
    message: "EDUTech backend is running",
    health: "/health",
    api: "/api",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Startup hook
async function main() {
  // Check DB and seed if online
  await checkDbConnection();
  await seedDatabase();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 EDUTech Express Backend listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal error during server startup:", err);
});
