export interface AttemptAnswerDraft {
  questionId: string;
  choiceId: string;
  correct: boolean;
}

export interface ResultsLocationState {
  result: {
    id: string;
    score: number;
    totalQuestions: number;
    timeMs: number;
    percentage: number;
    completedAt: string;
  };
  quizTitle: string;
  subjectSlug: string;
  subjectId: string;
  quizId: string;
}
