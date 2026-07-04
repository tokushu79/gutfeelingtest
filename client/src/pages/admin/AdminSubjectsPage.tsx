import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { Modal } from "../../components/ui/Modal";
import { TableRowSkeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../context/ToastContext";
import { getSubjectIcon, subjectIconMap } from "../../constants/subjectIcons";
import type { Subject } from "../../types";

const colorOptions = [
  "from-amber-500 to-red-600",
  "from-emerald-500 to-teal-600",
  "from-lime-500 to-green-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-fuchsia-500 to-pink-600",
  "from-indigo-500 to-blue-700",
  "from-orange-500 to-amber-600",
  "from-cyan-500 to-teal-600",
  "from-rose-500 to-pink-600",
];

interface FormState {
  name: string;
  description: string;
  icon: string;
  color: string;
}

const emptyForm: FormState = { name: "", description: "", icon: "Scroll", color: colorOptions[0] };

export default function AdminSubjectsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: subjects, isLoading } = useQuery({ queryKey: ["admin-subjects"], queryFn: adminApi.subjects.list });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
    queryClient.invalidateQueries({ queryKey: ["subjects"] });
  };

  const createMutation = useMutation({
    mutationFn: () => adminApi.subjects.create(form),
    onSuccess: () => {
      showToast("Subject created.", "success");
      invalidate();
      setModalOpen(false);
    },
    onError: (err: any) => showToast(err?.message ?? "Failed to create subject", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: () => adminApi.subjects.update(editing!.id, form),
    onSuccess: () => {
      showToast("Subject updated.", "success");
      invalidate();
      setModalOpen(false);
    },
    onError: (err: any) => showToast(err?.message ?? "Failed to update subject", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.subjects.remove(id),
    onSuccess: () => {
      showToast("Subject deleted.", "success");
      invalidate();
    },
    onError: (err: any) => showToast(err?.message ?? "Failed to delete subject", "error"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (subject: Subject) => {
    setEditing(subject);
    setForm({ name: subject.name, description: subject.description, icon: subject.icon, color: subject.color });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Subjects</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" /> New subject
        </button>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        {isLoading && <TableRowSkeleton columns={4} />}
        {subjects?.map((subject) => {
          const Icon = getSubjectIcon(subject.icon);
          return (
            <div key={subject.id} className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${subject.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{subject.name}</p>
                  <p className="text-xs text-slate-500">{subject.quizCount} quizzes · {subject.questionCount} questions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(subject)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label={`Edit ${subject.name}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${subject.name}" and all its quizzes/questions?`)) deleteMutation.mutate(subject.id);
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                  aria-label={`Delete ${subject.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {!isLoading && subjects?.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">No subjects yet. Create the first one.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit subject" : "New subject"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editing ? updateMutation.mutate() : createMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Icon</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(subjectIconMap).map((iconName) => {
                const Icon = subjectIconMap[iconName];
                const active = form.icon === iconName;
                return (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => setForm({ ...form, icon: iconName })}
                    className={`rounded-lg border p-2 ${active ? "border-violet-400 bg-violet-500/20" : "border-white/10 hover:bg-white/5"}`}
                    aria-label={iconName}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setForm({ ...form, color })}
                  className={`h-8 w-8 rounded-lg bg-gradient-to-br ${color} ${form.color === color ? "ring-2 ring-white" : ""}`}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary w-full">
            {editing ? "Save changes" : "Create subject"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
