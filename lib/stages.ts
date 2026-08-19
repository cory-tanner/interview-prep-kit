import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * The reusable stage-name list is deliberately decoupled from Job.stages[].name
 * in data/jobs.json. Removing a name here never touches existing job data — a
 * job that already has a stage called "Withdrawn" keeps it, status/date and
 * all. Removal only affects which names are offered for *future* stages.
 * Never add a cascade-delete here.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const STAGES_PATH = path.join(DATA_DIR, "stages.json");
const STAGES_EXAMPLE_PATH = path.join(DATA_DIR, "stages.example.json");

async function ensureStagesFile(): Promise<void> {
  try {
    await fs.access(STAGES_PATH);
  } catch {
    const example = await fs.readFile(STAGES_EXAMPLE_PATH, "utf-8");
    await fs.writeFile(STAGES_PATH, example, "utf-8");
  }
}

function sortNames(names: string[]): string[] {
  return [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

async function readRawNames(): Promise<string[]> {
  await ensureStagesFile();
  const raw = await fs.readFile(STAGES_PATH, "utf-8");
  return JSON.parse(raw) as string[];
}

async function writeNames(names: string[]): Promise<void> {
  const tmpPath = `${STAGES_PATH}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(names, null, 2) + "\n", "utf-8");
  await fs.rename(tmpPath, STAGES_PATH);
}

export async function readStageNames(): Promise<string[]> {
  return sortNames(await readRawNames());
}

export async function addStageName(name: string): Promise<string[]> {
  const trimmed = name.trim();
  const names = await readRawNames();
  const exists = names.some((n) => n.toLowerCase() === trimmed.toLowerCase());
  if (!exists) {
    names.push(trimmed);
    await writeNames(names);
  }
  return sortNames(names);
}

export async function removeStageName(name: string): Promise<{ removed: boolean; names: string[] }> {
  const names = await readRawNames();
  const next = names.filter((n) => n.toLowerCase() !== name.toLowerCase());
  const removed = next.length !== names.length;
  if (removed) {
    await writeNames(next);
  }
  return { removed, names: sortNames(next) };
}
