import { prisma } from "./prismaClient.js";
import type {
  Subject,
  Quiz,
  Question,
  Player,
  Attempt,
  DailyQuestion,
  DailySubmission,
  AdminUser,
} from "../types/index.js";

/**
 * Thin adapter that gives each Prisma model the same all/findById/insert/
 * update/remove/replaceAll surface the old JSON-file JsonCollection<T> had.
 * Every service and route in this codebase was written against that
 * surface, so swapping the storage engine from JSON files to real Postgres
 * tables (via Prisma) required changing only this file and the schema —
 * nothing in services/routes/seed needed to change.
 */
class PrismaCollection<T extends { id: string }> {
  constructor(private readonly delegate: any) {}

  async all(): Promise<T[]> {
    return this.delegate.findMany();
  }

  async findById(id: string): Promise<T | undefined> {
    const item = await this.delegate.findUnique({ where: { id } });
    return item ?? undefined;
  }

  async replaceAll(items: T[]): Promise<void> {
    const ops: any[] = [this.delegate.deleteMany({})];
    if (items.length > 0) {
      ops.push(this.delegate.createMany({ data: items }));
    }
    await prisma.$transaction(ops);
  }

  async insert(item: T): Promise<T> {
    return this.delegate.create({ data: item });
  }

  async update(id: string, patch: Partial<T>): Promise<T | undefined> {
    try {
      return await this.delegate.update({ where: { id }, data: patch });
    } catch {
      return undefined;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.delegate.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const subjects = new PrismaCollection<Subject>(prisma.subject);
export const quizzes = new PrismaCollection<Quiz>(prisma.quiz);
export const questions = new PrismaCollection<Question>(prisma.question);
export const players = new PrismaCollection<Player>(prisma.player);
export const attempts = new PrismaCollection<Attempt>(prisma.attempt);
export const dailyQuestions = new PrismaCollection<DailyQuestion>(prisma.dailyQuestion);
export const dailySubmissions = new PrismaCollection<DailySubmission>(prisma.dailySubmission);
export const admins = new PrismaCollection<AdminUser>(prisma.adminUser);
