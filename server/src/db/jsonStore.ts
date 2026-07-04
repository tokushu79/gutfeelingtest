import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.resolve(__dirname, "../../data");

// Serializes writes per-file so concurrent requests never corrupt a JSON file.
const writeQueues = new Map<string, Promise<void>>();

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

export async function readCollection<T>(name: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(filePath(name), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await writeCollection(name, fallback);
      return fallback;
    }
    throw err;
  }
}

export async function writeCollection<T>(name: string, data: T): Promise<void> {
  await ensureDataDir();
  const prior = writeQueues.get(name) ?? Promise.resolve();
  const task = prior
    .catch(() => {})
    .then(async () => {
      const target = filePath(name);
      const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
      await fs.rename(tmp, target);
    });
  writeQueues.set(name, task);
  return task;
}

/**
 * Generic collection helper providing CRUD semantics over a JSON array file.
 * Every mutating operation re-reads before writing so concurrent callers
 * within the same process still observe a consistent, queued sequence.
 */
export class JsonCollection<T extends { id: string }> {
  constructor(private readonly name: string) {}

  async all(): Promise<T[]> {
    return readCollection<T[]>(this.name, []);
  }

  async findById(id: string): Promise<T | undefined> {
    const items = await this.all();
    return items.find((i) => i.id === id);
  }

  async replaceAll(items: T[]): Promise<void> {
    await writeCollection(this.name, items);
  }

  async insert(item: T): Promise<T> {
    const items = await this.all();
    items.push(item);
    await writeCollection(this.name, items);
    return item;
  }

  async update(id: string, patch: Partial<T>): Promise<T | undefined> {
    const items = await this.all();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...patch };
    await writeCollection(this.name, items);
    return items[idx];
  }

  async remove(id: string): Promise<boolean> {
    const items = await this.all();
    const next = items.filter((i) => i.id !== id);
    if (next.length === items.length) return false;
    await writeCollection(this.name, next);
    return true;
  }
}
