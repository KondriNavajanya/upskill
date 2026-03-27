import { motion } from "framer-motion";

const StatCard = ({ title, value, subtitle, icon: Icon, tone = "accent" }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="glass-card p-5"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      <div
        className={`rounded-2xl p-3 ${
          tone === "ocean"
            ? "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
            : tone === "gold"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
              : "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
