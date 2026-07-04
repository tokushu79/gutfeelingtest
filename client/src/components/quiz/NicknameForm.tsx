import { useState, type FormEvent } from "react";
import { validateNickname } from "../../utils/validation";
import { useToast } from "../../context/ToastContext";

interface Props {
  initialValue?: string;
  submitLabel?: string;
  onSubmit: (nickname: string) => Promise<void>;
}

export function NicknameForm({ initialValue = "", submitLabel = "Save nickname", onSubmit }: Props) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateNickname(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(value.trim());
      showToast("Nickname saved.", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Couldn't save nickname, try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="nickname" className="mb-1.5 block text-sm font-medium text-slate-300">
          Nickname
        </label>
        <input
          id="nickname"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. quiz_wanderer_42"
          maxLength={20}
          autoFocus
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-400"
          aria-describedby="nickname-hint"
        />
        <p id="nickname-hint" className="mt-1.5 text-xs text-slate-500">
          3–20 characters. Letters, numbers, and underscores only.
        </p>
        {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
