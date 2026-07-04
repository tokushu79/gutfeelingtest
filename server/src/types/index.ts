// Core domain types shared across the server.

export interface Subject {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // tailwind gradient key
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  choices: Choice[]; // exactly 4
  correctChoiceId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Public-facing question shape with the answer key stripped out.
export interface PublicQuestion {
  id: string;
  quizId: string;
  text: string;
  choices: Choice[];
}

export interface Player {
  id: string;
  nickname: string;
  nicknameLower: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface AttemptAnswer {
  questionId: string;
  choiceId: string;
  correct: boolean;
}

export interface Attempt {
  id: string;
  playerId: string;
  nickname: string;
  quizId: string;
  subjectId: string;
  score: number;
  totalQuestions: number;
  timeMs: number;
  answers: AttemptAnswer[];
  completedAt: string;
}

export interface DailyQuestion {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  choices: Choice[];
  correctChoiceId: string;
  source: "scheduled" | "auto";
  createdAt: string;
}

export interface DailySubmission {
  id: string;
  date: string;
  playerId: string;
  nickname: string;
  correct: boolean;
  timeMs: number;
  submittedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  score: number;
  totalQuestions: number;
  timeMs: number;
  date: string;
  percentage: number;
}
