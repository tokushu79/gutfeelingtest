export interface Subject {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  quizCount: number;
  questionCount: number;
}

export interface Quiz {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  questionCount?: number;
}

export interface Choice {
  id: string;
  text: string;
}

export interface PublicQuestion {
  id: string;
  quizId: string;
  text: string;
  choices: Choice[];
}

export interface QuizPlayResponse {
  quiz: Quiz;
  subject: Subject;
  questions: PublicQuestion[];
}

export interface Player {
  id: string;
  nickname: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface CheckAnswerResponse {
  correct: boolean;
  correctChoiceId: string;
}

export interface SubmitAttemptResponse {
  id: string;
  score: number;
  totalQuestions: number;
  timeMs: number;
  percentage: number;
  completedAt: string;
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

export interface DailyQuestionResponse {
  id: string;
  date: string;
  text: string;
  choices: Choice[];
  alreadySubmitted: boolean;
}

export interface DailySubmitResponse {
  correct: boolean;
  correctChoiceId: string;
}

export interface DashboardStats {
  totalSubjects: number;
  totalQuizzes: number;
  totalQuestions: number;
  totalPlayers: number;
  totalAttempts: number;
  attemptsToday: number;
  dailySubmissionsToday: number;
  averageScorePercentage: number;
  perSubject: { subjectId: string; name: string; quizCount: number; attemptCount: number }[];
}

export interface AdminQuestion {
  id: string;
  quizId: string;
  text: string;
  choices: Choice[];
  correctChoiceId: string;
  order: number;
}

export interface AdminDailyQuestion {
  id: string;
  date: string;
  text: string;
  choices: Choice[];
  correctChoiceId: string;
  source: "scheduled" | "auto";
}
