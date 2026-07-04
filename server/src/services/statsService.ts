import { subjects, quizzes, questions, players, attempts, dailySubmissions } from "../db/collections.js";
import { todayKey } from "../utils/date.js";

export async function getDashboardStats() {
  const [allSubjects, allQuizzes, allQuestions, allPlayers, allAttempts, allDailySubs] =
    await Promise.all([
      subjects.all(),
      quizzes.all(),
      questions.all(),
      players.all(),
      attempts.all(),
      dailySubmissions.all(),
    ]);

  const today = todayKey();
  const attemptsToday = allAttempts.filter((a) => a.completedAt.startsWith(today)).length;
  const totalScore = allAttempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestionsAnswered = allAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const avgPercentage =
    totalQuestionsAnswered > 0 ? Math.round((totalScore / totalQuestionsAnswered) * 100) : 0;

  const perSubject = allSubjects.map((s) => {
    const subjectQuizzes = allQuizzes.filter((q) => q.subjectId === s.id);
    const subjectAttempts = allAttempts.filter((a) => a.subjectId === s.id);
    return {
      subjectId: s.id,
      name: s.name,
      quizCount: subjectQuizzes.length,
      attemptCount: subjectAttempts.length,
    };
  });

  return {
    totalSubjects: allSubjects.length,
    totalQuizzes: allQuizzes.length,
    totalQuestions: allQuestions.length,
    totalPlayers: allPlayers.length,
    totalAttempts: allAttempts.length,
    attemptsToday,
    dailySubmissionsToday: allDailySubs.filter((s) => s.date === today).length,
    averageScorePercentage: avgPercentage,
    perSubject,
  };
}
