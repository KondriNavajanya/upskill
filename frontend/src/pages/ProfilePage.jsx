import { BadgeCheck, MoonStar, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { fetchProfile, updatePreferences } from "../services/userService";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    fetchProfile().then((data) => {
      setProfile(data);
      setUser(data);
    });
  }, [setUser]);

  const handleThemeSync = async () => {
    const next = !darkMode;
    setDarkMode(next);
    const updated = await updatePreferences({ darkMode: next });
    setProfile(updated);
    setUser(updated);
  };

  if (!profile) {
    return <div className="glass-card p-6">Loading profile...</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-accent-50 p-4 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
            <UserCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{profile.institution}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-800/70">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Leaderboard snapshot</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.leaderboard?.points || 0}</p>
              <p className="text-xs text-slate-500">Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.leaderboard?.testsTaken || 0}
              </p>
              <p className="text-xs text-slate-500">Tests</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.leaderboard?.streak || 0}</p>
              <p className="text-xs text-slate-500">Streak</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MoonStar className="h-5 w-5 text-accent-600" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Dark mode preference</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sync UI theme to your profile</p>
              </div>
            </div>
            <button className="btn-primary" type="button" onClick={handleThemeSync}>
              {darkMode ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-teal-600" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Progress Badges</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Milestones you have unlocked</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profile.badges?.length ? (
              profile.badges.map((badge) => (
                <div key={`${badge.name}-${badge.awardedAt}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="font-semibold text-slate-900 dark:text-white">{badge.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{badge.reason}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Complete tests to unlock badges.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
