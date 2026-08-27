import { readFile } from "fs/promises";
import path from "path";
import type { LawsCatalog } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "laws", "states-ui.json");

export async function loadLawsCatalog(): Promise<LawsCatalog> {
  const raw = await readFile(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as LawsCatalog;

  if (!Array.isArray(parsed.states) || parsed.states.length === 0) {
    throw new Error("data/laws/states-ui.json has no jurisdictions");
  }

  return parsed;
}
