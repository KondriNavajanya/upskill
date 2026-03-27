import { Moon, Sun, Trophy } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { logout, user } = useAuth();

  return (
    <header className="glass-card sticky top-4 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-600">AI Skill Platform</p>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Learn. Test. Level up.</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700 sm:flex dark:bg-amber-500/10 dark:text-amber-300">
          <Trophy className="h-4 w-4" />
          {user?.leaderboard?.points ?? 0} pts
        </div>
        <button
          className="btn-secondary !rounded-full !px-3"
          onClick={() => setDarkMode(!darkMode)}
          type="button"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="btn-primary" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
