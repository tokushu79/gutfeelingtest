import { useQuery } from "@tanstack/react-query";
import { Layers, ListChecks, HelpCircle, Users, Activity, Percent } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

interface StatCard {
  key: "totalSubjects" | "totalQuizzes" | "totalQuestions" | "totalPlayers" | "totalAttempts" | "averageScorePercentage";
  label: string;
  icon: typeof Layers;
  suffix?: string;
}

const statCards: StatCard[] = [
  { key: "totalSubjects", label: "Subjects", icon: Layers },
  { key: "totalQuizzes", label: "Quizzes", icon: ListChecks },
  { key: "totalQuestions", label: "Questions", icon: HelpCircle },
  { key: "totalPlayers", label: "Players", icon: Users },
  { key: "totalAttempts", label: "Total attempts", icon: Activity },
  { key: "averageScorePercentage", label: "Avg. score", icon: Percent, suffix: "%" },
];

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.stats });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, suffix }) => (
          <div key={key} className="glass-panel rounded-2xl p-5">
            <Icon className="mb-2 h-5 w-5 text-violet-400" />
            <p className="text-2xl font-bold text-white">
              {isLoading || !data ? "—" : `${data[key]}${suffix ?? ""}`}
            </p>
            <p className="text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 glass-panel rounded-2xl p-5">
        <h2 className="mb-3 font-display text-lg font-semibold text-white">Attempts today</h2>
        <p className="text-3xl font-bold text-white">{isLoading || !data ? "—" : data.attemptsToday}</p>
        <p className="mt-1 text-sm text-slate-400">
          {isLoading || !data ? "" : `${data.dailySubmissionsToday} daily-question submissions today`}
        </p>
      </div>

      <div className="mt-8 glass-panel overflow-hidden rounded-2xl">
        <div className="border-b border-white/10 px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-white">Attempts by subject</h2>
        </div>
        {isLoading && <TableRowSkeleton columns={3} />}
        {data?.perSubject.map((s) => (
          <div key={s.subjectId} className="grid grid-cols-3 gap-4 border-b border-white/5 px-5 py-3 text-sm last:border-0">
            <span className="text-white">{s.name}</span>
            <span className="text-slate-400">{s.quizCount} quizzes</span>
            <span className="text-slate-400">{s.attemptCount} attempts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
