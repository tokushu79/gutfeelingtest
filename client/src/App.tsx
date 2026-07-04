import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminRouteGuard } from "./components/admin/AdminRouteGuard";
import NotFound from "./pages/NotFound";

const Home = lazy(() => import("./pages/Home"));
const SubjectPage = lazy(() => import("./pages/SubjectPage"));
const QuizPlayPage = lazy(() => import("./pages/QuizPlayPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const LeaderboardsHub = lazy(() => import("./pages/LeaderboardsHub"));
const SubjectLeaderboardPage = lazy(() => import("./pages/SubjectLeaderboardPage"));
const QuizLeaderboardPage = lazy(() => import("./pages/QuizLeaderboardPage"));
const DailyQuestionPage = lazy(() => import("./pages/DailyQuestionPage"));
const DailyLeaderboardPage = lazy(() => import("./pages/DailyLeaderboardPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminSubjectsPage = lazy(() => import("./pages/admin/AdminSubjectsPage"));
const AdminQuizzesPage = lazy(() => import("./pages/admin/AdminQuizzesPage"));
const AdminQuestionsPage = lazy(() => import("./pages/admin/AdminQuestionsPage"));
const AdminDailyPage = lazy(() => import("./pages/admin/AdminDailyPage"));
const AdminLeaderboardsPage = lazy(() => import("./pages/admin/AdminLeaderboardsPage"));

function RouteLoadingFallback() {
  return <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">Loading…</div>;
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/subjects/:slug" element={<SubjectPage />} />
          <Route path="/play/:quizId" element={<QuizPlayPage />} />
          <Route path="/results/:attemptId" element={<ResultsPage />} />
          <Route path="/leaderboards" element={<LeaderboardsHub />} />
          <Route path="/leaderboards/subject/:subjectId" element={<SubjectLeaderboardPage />} />
          <Route path="/leaderboards/quiz/:quizId" element={<QuizLeaderboardPage />} />
          <Route path="/daily" element={<DailyQuestionPage />} />
          <Route path="/daily/leaderboard" element={<DailyLeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <Routes>
                <Route path="login" element={<AdminLoginPage />} />
                <Route
                  element={
                    <AdminRouteGuard>
                      <AdminLayout />
                    </AdminRouteGuard>
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="subjects" element={<AdminSubjectsPage />} />
                  <Route path="quizzes" element={<AdminQuizzesPage />} />
                  <Route path="questions" element={<AdminQuestionsPage />} />
                  <Route path="daily" element={<AdminDailyPage />} />
                  <Route path="leaderboards" element={<AdminLeaderboardsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminAuthProvider>
          }
        />
      </Routes>
    </Suspense>
  );
}
