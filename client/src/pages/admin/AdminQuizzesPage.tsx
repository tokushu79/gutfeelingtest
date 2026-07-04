import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { Modal } from "../../components/ui/Modal";
import { TableRowSkeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../context/ToastContext";
import type { Quiz } from "../../types";

interface FormState {
  subjectId: string;
  title: string;
  description: string;
}

export default function AdminQuizzesPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: subjects } = useQuery({ queryKey: ["admin-subjects"], queryFn: adminApi.subjects.list });
  const { data: quizzes, isLoading } = useQuery({ queryKey: ["admin-quizzes"], queryFn: () => adminApi.quizzes.list() });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [form, setForm] = useState<FormState>({ subjectId: "", title: "", description: "" });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });

  const createMutation = useMutation({
    mutationFn: () => adminApi.quizzes.create(form),
    onSuccess: () => {
      showToast("Quiz created.", "success");
      invalidate();
      setModalOpen(false);
    },
    onError: (err: any) => showToast(err?.message ?? "Failed to create quiz", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: () => adminApi.quizzes.update(editing!.id, { title: form.title, description: form.description }),
    onSuccess: () => {
      showToast("Quiz updated.", "success");
      invalidate();
      setModalOpen(false);
    },
    onError: (err: any) => showToast(err?.message ?? "Failed to update quiz", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.quizzes.remove(id),
    onSuccess: () => {
      showToast("Quiz deleted.", "success");
      invalidate();
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => adminApi.quizzes.duplicate(id),
    onSuccess: () => {
      showToast("Quiz duplicated.", "success");
      invalidate();
    },
  });

  const subjectName = (id: string) => subjects?.find((s) => s.id === id)?.name ?? "Unknown subject";

  const openCreate = () => {
    setEditing(null);
    setForm({ subjectId: subjects?.[0]?.id ?? "", title: "", description: "" });
    setModalOpen(true);
  };

  const openEdit = (quiz: Quiz) => {
    setEditing(quiz);
    setForm({ subjectId: quiz.subjectId, title: quiz.title, description: quiz.description });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Quizzes</h1>
        <button onClick={openCreate} className="btn-primary" disabled={!subjects?.length}>
          <Plus className="h-4 w-4" /> New quiz
        </button>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        {isLoading && <TableRowSkeleton columns={4} />}
        {quizzes?.map((quiz) => (
          <div key={quiz.id} className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-0">
            <div>
              <p className="font-semibold text-white">{quiz.title}</p>
              <p className="text-xs text-slate-500">{subjectName(quiz.subjectId)} · {quiz.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => duplicateMutation.mutate(quiz.id)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label={`Duplicate ${quiz.title}`}>
                <Copy className="h-4 w-4" />
              </button>
              <button onClick={() => openEdit(quiz)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label={`Edit ${quiz.title}`}>
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${quiz.title}" and all its questions?`)) deleteMutation.mutate(quiz.id);
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                aria-label={`Delete ${quiz.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {!isLoading && quizzes?.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">No quizzes yet.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit quiz" : "New quiz"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editing ? updateMutation.mutate() : createMutation.mutate();
          }}
          className="space-y-4"
        >
          {!editing && (
            <div>
              <label className="mb-1.5 block text-sm text-slate-300">Subject</label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
              >
                {subjects?.map((s) => (
                  <option key={s.id} value={s.id} className="bg-base-900">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
              rows={2}
              required
            />
          </div>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary w-full">
            {editing ? "Save changes" : "Create quiz"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
