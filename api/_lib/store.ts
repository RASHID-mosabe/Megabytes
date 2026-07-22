import fs from "fs";
import path from "path";
import { DB, DEFAULT_DB } from "./defaultData";

const DB_PATH = path.join(process.cwd(), "src", "db.json");
const KV_KEY = "megabytes:db";

// On Vercel the filesystem is read-only (except /tmp, which is wiped between
// invocations), so we can't persist src/db.json the way local dev does.
// Instead we use a Redis store (via Vercel's Marketplace "Upstash Redis"
// integration) to hold the same JSON blob under one key.
// Locally (no VERCEL env var) we keep using the plain JSON file, so `npm run dev`
// keeps working with zero extra setup.
const useKv = !!process.env.VERCEL;

let redisClientPromise: Promise<any> | null = null;
function getRedis() {
  if (!redisClientPromise) {
    redisClientPromise = import("@upstash/redis").then((mod) => mod.Redis.fromEnv());
  }
  return redisClientPromise;
}

export async function readDB(): Promise<DB> {
  if (useKv) {
    try {
      const redis = await getRedis();
      const data = (await redis.get(KV_KEY)) as DB | null;
      if (!data) {
        await redis.set(KV_KEY, DEFAULT_DB);
        return DEFAULT_DB;
      }
      return data;
    } catch (err) {
      console.error("Error reading from Redis, returning default data", err);
      return DEFAULT_DB;
    }
  }

  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, returning default", err);
    return DEFAULT_DB;
  }
}

export async function writeDB(data: DB): Promise<void> {
  if (useKv) {
    try {
      const redis = await getRedis();
      await redis.set(KV_KEY, data);
    } catch (err) {
      console.error("Error writing to Redis", err);
    }
    return;
  }

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file", err);
  }
}
