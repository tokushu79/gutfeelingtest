import { JsonCollection } from "./jsonStore.js";
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

export const subjects = new JsonCollection<Subject>("subjects");
export const quizzes = new JsonCollection<Quiz>("quizzes");
export const questions = new JsonCollection<Question>("questions");
export const players = new JsonCollection<Player>("players");
export const attempts = new JsonCollection<Attempt>("attempts");
export const dailyQuestions = new JsonCollection<DailyQuestion>("dailyQuestions");
export const dailySubmissions = new JsonCollection<DailySubmission>("dailySubmissions");
export const admins = new JsonCollection<AdminUser>("admins");
