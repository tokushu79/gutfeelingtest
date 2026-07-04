import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RotateCcw, Trophy } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";

export default function AdminLeaderboardsPage() {
  const { showToast } = useToast();
  const { data: subjects } = useQuery({ queryKey: ["admin-subjects"], queryFn: adminApi.subjects.list });
  const { data: quizzes } = useQuery({ queryKey: ["admin-quizzes"], queryFn: () => adminApi.quizzes.list() });
  const [subjectId, setSubjectId] = useState("");
  const [quizId, setQuizId] = useState("");

  const resetMutation = useMutation({
    mutationFn: (input: { scope: "overall" | "subject" | "quiz" | "daily"; id?: string }) =>
      adminApi.leaderboards.reset(input.scope, input.id),
    onSuccess: () => showToast("Leaderboard reset.", "success"),
    onError: (err: any) => showToast(err?.message ?? "Reset failed", "error"),
  });

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Trophy className="h-7 w-7 text-amber-400" />
        <h1 className="font-display text-2xl font-bold text-white">Leaderboards</h1>
      </div>
      <p className="mb-6 max-w-lg text-sm text-slate-400">
        Resetting a leaderboard permanently deletes the underlying attempt records for that scope.
        This can't be undone.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-panel rounded-2xl p-5">
          <h2 className="mb-2 font-semibold text-white">Overall leaderboard</h2>
          <p className="mb-4 text-sm text-slate-400">Wipes every attempt and daily submission site-wide.</p>
          <button
            onClick={() => confirm("Reset the ENTIRE overall leaderboard?") && resetMutation.mutate({ scope: "overall" })}
            className="btn-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Reset overall
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h2 className="mb-2 font-semibold text-white">Daily leaderboard</h2>
          <p className="mb-4 text-sm text-slate-400">Clears all daily-question submissions.</p>
          <button
            onClick={() => confirm("Reset the daily leaderboard?") && resetMutation.mutate({ scope: "daily" })}
            className="btn-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Reset daily
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h2 className="mb-2 font-semibold text-white">Subject leaderboard</h2>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="mb-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white"
          >
            <option value="" className="bg-base-900">Choose a subject…</option>
            {subjects?.map((s) => (
              <option key={s.id} value={s.id} className="bg-base-900">{s.name}</option>
            ))}
          </select>
          <button
            disabled={!subjectId}
            onClick={() => confirm("Reset this subject's leaderboard?") && resetMutation.mutate({ scope: "subject", id: subjectId })}
            className="btn-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Reset subject
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h2 className="mb-2 font-semibold text-white">Quiz leaderboard</h2>
          <select
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            className="mb-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white"
          >
            <option value="" className="bg-base-900">Choose a quiz…</option>
            {quizzes?.map((q) => (
              <option key={q.id} value={q.id} className="bg-base-900">{q.title}</option>
            ))}
          </select>
          <button
            disabled={!quizId}
            onClick={() => confirm("Reset this quiz's leaderboard?") && resetMutation.mutate({ scope: "quiz", id: quizId })}
            className="btn-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Reset quiz
          </button>
        </div>
      </div>
    </div>
  );
}
