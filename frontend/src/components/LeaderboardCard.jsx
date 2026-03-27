import { Crown } from "lucide-react";

const LeaderboardCard = ({ entries = [] }) => (
  <div className="glass-card p-5">
    <div className="mb-4 flex items-center gap-3">
      <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
        <Crown className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Leaderboard</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Top students this week</p>
      </div>
    </div>

    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={entry._id}
          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70"
        >
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              #{index + 1} {entry.user?.name}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{entry.user?.institution}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-accent-600">{entry.points} pts</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{entry.averageScore}% avg</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LeaderboardCard;
