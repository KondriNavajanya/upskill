import { Award, BookMarked, ChartColumnBig, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import CareerCard from "../components/CareerCard";
import LeaderboardCard from "../components/LeaderboardCard";
import StatCard from "../components/StatCard";
import PerformanceChart from "../components/charts/PerformanceChart";
import TopicChart from "../components/charts/TopicChart";
import { fetchCareerSuggestion } from "../services/aiService";
import { fetchLeaderboard, fetchProgress } from "../services/userService";
import { formatDate } from "../utils/formatters";

const DashboardPage = () => {
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [careerSuggestion, setCareerSuggestion] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [progressData, leaderboardData] = await Promise.all([
        fetchProgress(),
        fetchLeaderboard()
      ]);
      setProgress(progressData);
      setLeaderboard(leaderboardData);

      try {
        const career = await fetchCareerSuggestion();
        setCareerSuggestion(career);
      } catch (error) {
        setCareerSuggestion(null);
      }
    };

    load();
  }, []);

  if (!progress) {
    return <div className="glass-card p-6">Loading dashboard...</div>;
  }

  const lowTopic = Object.entries(progress.topicScores || {}).sort((a, b) => a[1] - b[1])[0];
  const recommendedTopic = lowTopic ? lowTopic[0] : "General Review";

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tests Taken"
          value={progress.stats.totalTestsTaken}
          subtitle="Keep the streak alive"
          icon={ChartColumnBig}
        />
        <StatCard
          title="Average Score"
          value={`${progress.stats.averageScore}%`}
          subtitle="Across all completed tests"
          icon={Award}
          tone="ocean"
        />
        <StatCard
          title="Bookmarks"
          value={progress.stats.bookmarksCount}
          subtitle="Saved for revision"
          icon={BookMarked}
          tone="gold"
        />
        <StatCard
          title="Current Streak"
          value={progress.stats.streak}
          subtitle={`${progress.stats.points} leaderboard points`}
          icon={Flame}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <PerformanceChart data={progress.performanceTimeline} />
        <CareerCard suggestion={careerSuggestion} />
      </section>

      <section className="glass-card p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Practice suggestion</h3>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          Based on your current performance, focus next on:
          <span className="font-bold text-accent-600 dark:text-accent-300"> {recommendedTopic}</span>
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <TopicChart topicScores={progress.topicScores} />
        <LeaderboardCard entries={leaderboard} />
      </section>

      <section className="glass-card p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
        <div className="mt-4 grid gap-3">
          {progress.recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{item.topic}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.difficulty} • {formatDate(item.date)}
                </p>
              </div>
              <div className="rounded-full bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
                {item.score}%
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
