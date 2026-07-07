import "dotenv/config";
import { seedContentIfEmpty } from "./seedContent.js";
import { ensureSeedAdmin } from "../services/authService.js";

async function seed() {
  const created = await seedContentIfEmpty();
  if (!created) {
    console.log("[seed] Subjects already exist in the database — skipping content seed.");
    console.log("[seed] Truncate the subjects/quizzes/questions tables if you want to reseed from scratch.");
  }

  await ensureSeedAdmin();
  console.log("[seed] Done.");
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
