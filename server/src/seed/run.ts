import "dotenv/config";
import { seedContentIfEmpty } from "./seedContent.js";
import { ensureSeedAdmin } from "../services/authService.js";

async function seed() {
  const created = await seedContentIfEmpty();
  if (!created) {
    console.log("[seed] Subjects already exist — skipping content seed (data/ already populated).");
    console.log("[seed] Delete the server/data/*.json files if you want to reseed from scratch.");
  }

  await ensureSeedAdmin();
  console.log("[seed] Done.");
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
