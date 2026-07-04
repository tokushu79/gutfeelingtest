import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Upload, Download } from "lucide-react";
import { adminApi, type QuestionInput } from "../../services/adminApi";
import { Modal } from "../../components/ui/Modal";
import { TableRowSkeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../context/ToastContext";
import { ADMIN_TOKEN_STORAGE_KEY } from "../../constants/config";
import type { AdminQuestion } from "../../types";

const emptyForm: QuestionInput = {
  text: "",
  choices: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
  correctChoiceIndex: 0,
};

export default function AdminQuestionsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: quizzes } = useQuery({ queryKey: ["admin-quizzes"], queryFn: () => adminApi.quizzes.list() });
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [search, setSearch] = useState("");

  const effectiveQuizId = selectedQuizId || quizzes?.[0]?.id || "";

  const { data: questions, isLoading } = useQuery({
    queryKey: ["admin-questions", effectiveQuizId, search],
    queryFn: () => (search ? adminApi.questions.search(search) : adminApi.questions.forQuiz(effectiveQuizId)),
    enabled: !!effectiveQuizId || !!search,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminQuestion | null>(null);
  const [form, setForm] = useState<QuestionInput>(emptyForm);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-questions"] });

  const createMutation = useMutation({
    mutationFn: () => adminApi.questions.create(effectiveQuizId, form),
    onSuccess: () => {
      showToast("Question created.", "success");
      invalidate();
      setModalOpen(false);
    },
    onError: (err: any) => showToast(err?.message ?? "Failed to create question", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: () => adminApi.questions.update(editing!.id, form),
    onSuccess: () => {
      showToast("Question updated.", "success");
      invalidate();
      setModalOpen(false);
    },
    onError: (err: any) => showToast(err?.message ?? "Failed to update question", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.questions.remove(id),
    onSuccess: () => {
      showToast("Question deleted.", "success");
      invalidate();
    },
  });

  const importMutation = useMutation({
    mutationFn: (items: QuestionInput[]) => adminApi.questions.import(effectiveQuizId, items),
    onSuccess: (res) => {
      showToast(`Imported ${res.imported} questions.`, "success");
      invalidate();
    },
    onError: (err: any) => showToast(err?.message ?? "Import failed — check the file format", "error"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (q: AdminQuestion) => {
    setEditing(q);
    setForm({
      text: q.text,
      choices: q.choices.map((c) => ({ text: c.text })),
      correctChoiceIndex: q.choices.findIndex((c) => c.id === q.correctChoiceId),
    });
    setModalOpen(true);
  };

  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { text: string; choices: string[]; correctChoiceIndex: number }[];
      const items: QuestionInput[] = parsed.map((p) => ({
        text: p.text,
        choices: p.choices.map((c) => ({ text: c })),
        correctChoiceIndex: p.correctChoiceIndex,
      }));
      importMutation.mutate(items);
    } catch {
      showToast("That file isn't valid JSON in the expected format.", "error");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExport = async () => {
    if (!effectiveQuizId) return;
    const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    const res = await fetch(adminApi.questions.exportUrl(effectiveQuizId), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      showToast("Export failed.", "error");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${effectiveQuizId}-questions.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-white">Questions</h1>
        <div className="flex flex-wrap gap-2">
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
            <Upload className="h-4 w-4" /> Import JSON
          </button>
          <button onClick={handleExport} disabled={!effectiveQuizId} className="btn-secondary">
            <Download className="h-4 w-4" /> Export quiz
          </button>
          <button onClick={openCreate} className="btn-primary" disabled={!effectiveQuizId}>
            <Plus className="h-4 w-4" /> New question
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={selectedQuizId || effectiveQuizId}
          onChange={(e) => {
            setSelectedQuizId(e.target.value);
            setSearch("");
          }}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-violet-400"
        >
          {quizzes?.map((q) => (
            <option key={q.id} value={q.id} className="bg-base-900">
              {q.title}
            </option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all questions..."
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-violet-400"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        {isLoading && <TableRowSkeleton columns={2} />}
        {questions?.map((q) => (
          <div key={q.id} className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-0">
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{q.text}</p>
              <p className="mt-1 text-xs text-slate-500">
                {q.choices.map((c) => c.text).join(" · ")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => openEdit(q)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Edit question">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => confirm("Delete this question?") && deleteMutation.mutate(q.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                aria-label="Delete question"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {!isLoading && questions?.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">No questions found.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit question" : "New question"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editing ? updateMutation.mutate() : createMutation.mutate();
          }}
          className="space-y-4"
        >
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
                  name="correct"
                  checked={form.correctChoiceIndex === idx}
                  onChange={() => setForm({ ...form, correctChoiceIndex: idx })}
                  className="h-4 w-4 accent-violet-500"
                  aria-label={`Mark choice ${idx + 1} as correct`}
                />
                <input
                  value={choice.text}
                  onChange={(e) => {
                    const choices = [...form.choices];
                    choices[idx] = { text: e.target.value };
                    setForm({ ...form, choices });
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary w-full">
            {editing ? "Save changes" : "Create question"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
