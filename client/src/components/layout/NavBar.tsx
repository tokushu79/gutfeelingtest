import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Brain, Menu, X, User } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { useNickname } from "../../context/NicknameContext";

const links = [
  { to: ROUTES.home, label: "Subjects" },
  { to: ROUTES.daily, label: "Daily Impossible" },
  { to: ROUTES.leaderboards, label: "Leaderboards" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const { nickname } = useNickname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-base-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={ROUTES.home} className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <Brain className="h-6 w-6 text-violet-400" />
          <span className="hidden sm:inline">GutFeelingTest</span>
          <span className="sm:hidden">GutFeelingTest</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to={ROUTES.settings}
            className="ml-2 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            <User className="h-4 w-4" />
            {nickname ?? "Guest"}
          </Link>
        </nav>

        <button
          className="rounded-lg p-2 text-slate-300 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/5 px-4 pb-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to={ROUTES.settings}
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300"
          >
            <User className="h-4 w-4" />
            {nickname ?? "Guest"}
          </Link>
        </nav>
      )}
    </header>
  );
}
