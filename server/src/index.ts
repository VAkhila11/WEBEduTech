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
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client interactions
app.use(cors());
app.use(express.json());

// Load API endpoints
app.use("/api/auth", authRouter);
app.use("/api", explorerRouter);
app.use("/api/predictor", predictorRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Startup hook
async function main() {
  // Check DB and seed if online
  await checkDbConnection();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 EDUTech Express Backend listening at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal error during server startup:", err);
});
