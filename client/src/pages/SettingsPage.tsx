import { UserCog } from "lucide-react";
import { useNickname } from "../context/NicknameContext";
import { NicknameForm } from "../components/quiz/NicknameForm";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";

export default function SettingsPage() {
  const { nickname, setNickname } = useNickname();

  return (
    <PageTransition>
      <PageContainer narrow>
        <div className="mb-6 flex items-center gap-3">
          <UserCog className="h-7 w-7 text-violet-400" />
          <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        </div>
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <p className="mb-1 text-sm text-slate-400">Current nickname</p>
          <p className="mb-6 font-display text-xl font-semibold text-white">{nickname ?? "Not set"}</p>
          <NicknameForm initialValue={nickname ?? ""} onSubmit={setNickname} />
        </div>
      </PageContainer>
    </PageTransition>
  );
}
