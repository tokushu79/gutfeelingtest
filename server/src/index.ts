import "dotenv/config";
import express from "express";
import cors from "cors";
import { subjectsRouter } from "./routes/subjects.js";
import { quizzesRouter } from "./routes/quizzes.js";
import { playersRouter } from "./routes/players.js";
import { attemptsRouter } from "./routes/attempts.js";
import { leaderboardsRouter } from "./routes/leaderboards.js";
import { dailyRouter } from "./routes/daily.js";
import { adminRouter } from "./routes/admin/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { ensureSeedAdmin } from "./services/authService.js";
import { seedContentIfEmpty } from "./seed/seedContent.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "The Most Useless Quiz Ever API" });
});

app.use("/api/subjects", subjectsRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/players", playersRouter);
app.use("/api/attempts", attemptsRouter);
app.use("/api/leaderboards", leaderboardsRouter);
app.use("/api/daily", dailyRouter);
app.use("/api/admin", adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

async function start() {
  // Auto-recover the standard quiz content if the database is empty (e.g. a
  // host with a non-persistent disk just wiped server/data on restart).
  await seedContentIfEmpty();
  await ensureSeedAdmin();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`The Most Useless Quiz Ever API listening on http://localhost:${PORT}`);
  });
}

start();
