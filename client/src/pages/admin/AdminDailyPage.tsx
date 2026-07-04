import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, CalendarClock } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { Modal } from "../../components/ui/Modal";
import { TableRowSkeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/format";

interface FormState {
  date: string;
  text: string;
  choices: string[];
  correctChoiceIndex: number;
}

const emptyForm: FormState = { date: "", text: "", choices: ["", "", "", ""], correctChoiceIndex: 0 };

export default function AdminDailyPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["admin-daily"], queryFn: adminApi.daily.list });

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-daily"] });

  const scheduleMutation = useMutation({
    mutationFn: () =>
      adminApi.daily.schedule({
        date: form.date,
        text: form.text,
        choices: form.choices.map((text) => ({ text })),
        correctChoiceIndex: form.correctChoiceIndex,
      }),
    onSuccess: () => {
      showToast("Daily question scheduled.", "success");
      invalidate();
      setModalOpen(false);
      setForm(emptyForm);
    },
    onError: (err: any) => showToast(err?.message ?? "Failed to schedule question", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.daily.remove(id),
    onSuccess: () => {
      showToast("Removed.", "success");
      invalidate();
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Daily Impossible Question</h1>
        <button
          onClick={() => {
            setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
            setModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Schedule question
        </button>
      </div>
      <p className="mb-6 text-sm text-slate-400">
        Schedule a specific question for any date. Dates without a scheduled question automatically
        rotate through a fallback pool, so the daily question never repeats unexpectedly.
      </p>

      <div className="glass-panel overflow-hidden rounded-2xl">
        {isLoading && <TableRowSkeleton columns={3} />}
        {data?.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatDate(d.date)}
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${d.source === "scheduled" ? "bg-violet-500/20 text-violet-300" : "bg-white/10 text-slate-400"}`}>
                  {d.source}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-white">{d.text}</p>
            </div>
            <button
              onClick={() => confirm("Remove this daily question entry?") && deleteMutation.mutate(d.id)}
              className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
              aria-label="Delete daily question"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {!isLoading && data?.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">No daily questions scheduled yet.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule daily question">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            scheduleMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Question text</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-slate-300">Choices (select the correct one)</label>
            {form.choices.map((choice, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="daily-correct"
                  checked={form.correctChoiceIndex === idx}
                  onChange={() => setForm({ ...form, correctChoiceIndex: idx })}
                  className="h-4 w-4 accent-violet-500"
                />
                <input
                  value={choice}
                  onChange={(e) => {
                    const choices = [...form.choices];
                    choices[idx] = e.target.value;
                    setForm({ ...form, choices });
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" disabled={scheduleMutation.isPending} className="btn-primary w-full">
            Schedule
          </button>
        </form>
      </Modal>
    </div>
  );
}
