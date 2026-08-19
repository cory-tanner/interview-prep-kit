import { promises as fs } from "node:fs";
import path from "node:path";
import { slugify } from "./slug";

export type StageStatus = "complete" | "active" | "pending";

export interface Stage {
  name: string;
  date: string | null;
  status: StageStatus;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  stages: Stage[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const JOBS_PATH = path.join(DATA_DIR, "jobs.json");
const JOBS_EXAMPLE_PATH = path.join(DATA_DIR, "jobs.example.json");

const DEFAULT_STAGES: Stage[] = [
  { name: "Applied", date: null, status: "pending" },
  { name: "Recruiter Screen", date: null, status: "pending" },
  { name: "Technical Screen", date: null, status: "pending" },
  { name: "Onsite", date: null, status: "pending" },
  { name: "Offer", date: null, status: "pending" },
];

async function ensureJobsFile(): Promise<void> {
  try {
    await fs.access(JOBS_PATH);
  } catch {
    const example = await fs.readFile(JOBS_EXAMPLE_PATH, "utf-8");
    await fs.writeFile(JOBS_PATH, example, "utf-8");
  }
}

export async function readJobs(): Promise<Job[]> {
  await ensureJobsFile();
  const raw = await fs.readFile(JOBS_PATH, "utf-8");
  return JSON.parse(raw) as Job[];
}

async function writeJobs(jobs: Job[]): Promise<void> {
  const tmpPath = `${JOBS_PATH}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(jobs, null, 2) + "\n", "utf-8");
  await fs.rename(tmpPath, JOBS_PATH);
}

export async function getJob(id: string): Promise<Job | undefined> {
  const jobs = await readJobs();
  return jobs.find((j) => j.id === id);
}

export interface CreateJobInput {
  company: string;
  role: string;
  stages?: Stage[];
  notes?: string;
}

export async function createJob(input: CreateJobInput): Promise<Job> {
  const jobs = await readJobs();
  const baseSlug = slugify(input.company);
  let id = baseSlug;
  let n = 2;
  while (jobs.some((j) => j.id === id)) {
    id = `${baseSlug}-${n}`;
    n += 1;
  }
  const now = new Date().toISOString();
  const job: Job = {
    id,
    company: input.company,
    role: input.role,
    stages: input.stages && input.stages.length > 0 ? input.stages : DEFAULT_STAGES,
    notes: input.notes ?? "",
    createdAt: now,
    updatedAt: now,
  };
  jobs.push(job);
  await writeJobs(jobs);
  return job;
}

export type UpdateJobInput = Partial<Pick<Job, "company" | "role" | "notes" | "stages">>;

export async function updateJob(id: string, input: UpdateJobInput): Promise<Job | undefined> {
  const jobs = await readJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return undefined;
  const updated: Job = {
    ...jobs[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  jobs[index] = updated;
  await writeJobs(jobs);
  return updated;
}

export async function deleteJob(id: string): Promise<boolean> {
  const jobs = await readJobs();
  const next = jobs.filter((j) => j.id !== id);
  if (next.length === jobs.length) return false;
  await writeJobs(next);
  return true;
}

export interface UpdateStageInput {
  name: string;
  status?: StageStatus;
  date?: string | null;
}

export async function updateStage(id: string, input: UpdateStageInput): Promise<Job | undefined> {
  const jobs = await readJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return undefined;

  const job = jobs[index];
  const stageIndex = job.stages.findIndex((s) => s.name === input.name);
  const stages = [...job.stages];

  if (stageIndex === -1) {
    stages.push({
      name: input.name,
      status: input.status ?? "active",
      date: input.date ?? null,
    });
  } else {
    stages[stageIndex] = {
      ...stages[stageIndex],
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.date !== undefined ? { date: input.date } : {}),
    };
  }

  const updated: Job = { ...job, stages, updatedAt: new Date().toISOString() };
  jobs[index] = updated;
  await writeJobs(jobs);
  return updated;
}
