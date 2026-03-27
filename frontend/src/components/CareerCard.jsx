import { Compass } from "lucide-react";

const CareerCard = ({ suggestion }) => {
  if (!suggestion) {
    return (
      <div className="glass-card p-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Take a few tests to unlock AI-powered career recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-teal-100 p-3 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{suggestion.recommendedRole}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{suggestion.confidence}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{suggestion.why}</p>
      <div className="mt-4 space-y-2">
        {suggestion.roadmap?.map((step) => (
          <div key={step} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800/70">
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerCard;
