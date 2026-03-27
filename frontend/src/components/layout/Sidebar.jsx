import { BarChart3, BookOpen, Code2, Home, List, Sparkles, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/test", label: "AI Test Lab", icon: Sparkles },
  { to: "/problems", label: "Problems", icon: Code2 },
  { to: "/submissions", label: "My Submissions", icon: List },
  { to: "/results", label: "Results", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
  { to: "/bookmarks", label: "Bookmarks", icon: BookOpen }
];

const Sidebar = () => (
  <aside className="glass-card hidden h-fit w-64 flex-col gap-3 p-4 lg:flex">
    {links.map((link) => {
      const Icon = link.icon;

      return (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-slate-900 text-white dark:bg-accent-600"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {link.label}
        </NavLink>
      );
    })}
  </aside>
);

export default Sidebar;
