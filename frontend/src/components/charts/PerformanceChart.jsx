import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const PerformanceChart = ({ data }) => (
  <div className="glass-card p-5">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance Over Time</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">Track momentum across tests.</p>
    </div>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#db2777" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PerformanceChart;
