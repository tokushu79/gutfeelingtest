import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { ROUTES } from "../constants/routes";

export default function NotFound({ message }: { message?: string }) {
  return (
    <PageContainer narrow>
      <div className="glass-panel rounded-2xl p-10 text-center">
        <Compass className="mx-auto mb-4 h-10 w-10 text-slate-500" />
        <h1 className="font-display text-2xl font-bold text-white">404</h1>
        <p className="mt-2 text-sm text-slate-400">
          {message ?? "This page doesn't exist. Which, fittingly, nobody could have known."}
        </p>
        <Link to={ROUTES.home} className="btn-primary mt-6 inline-flex">
          Back to subjects
        </Link>
      </div>
    </PageContainer>
  );
}
