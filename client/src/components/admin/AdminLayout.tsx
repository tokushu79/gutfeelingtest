import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Layers, ListChecks, HelpCircle, CalendarClock, Trophy, LogOut, ExternalLink } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/subjects", label: "Subjects", icon: Layers },
  { to: "/admin/quizzes", label: "Quizzes", icon: ListChecks },
  { to: "/admin/questions", label: "Questions", icon: HelpCircle },
  { to: "/admin/daily", label: "Daily Question", icon: CalendarClock },
  { to: "/admin/leaderboards", label: "Leaderboards", icon: Trophy },
];

export function AdminLayout() {
  const { username, logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-base-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-base-900/60 p-4 sm:flex">
        <div className="mb-6 px-2">
          <p className="font-display text-lg font-bold text-white">Admin Panel</p>
          <p className="text-xs text-slate-500">Signed in as {username}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-violet-500/15 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
          <a href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <ExternalLink className="h-4 w-4" /> View site
          </a>
          <button onClick={logout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
