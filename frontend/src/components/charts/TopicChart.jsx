import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const TopicChart = ({ topicScores }) => {
  const data = Object.entries(topicScores)
    .filter(([, score]) => score > 0)
    .map(([topic, score]) => ({ topic, score }));

  return (
    <div className="glass-card p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Topic-Wise Scores</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">See which skill areas are strongest.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="topic" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill="#0d9488" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopicChart;
