import { Bookmark } from "lucide-react";

const QuestionCard = ({
  question,
  index,
  answer,
  onAnswerChange,
  onToggleBookmark,
  bookmarked
}) => (
  <div className="glass-card p-6">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-600">
          Question {index + 1}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{question.prompt}</h3>
      </div>
      <button
        type="button"
        className={`rounded-2xl p-3 ${
          bookmarked
            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
        }`}
        onClick={() => onToggleBookmark(question)}
      >
        <Bookmark className="h-4 w-4" />
      </button>
    </div>

    {question.type === "mcq" ? (
      <div className="space-y-3">
        {question.options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
              answer === option
                ? "border-accent-500 bg-accent-50 dark:bg-accent-500/10"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <input
              type="radio"
              name={`question-${index}`}
              checked={answer === option}
              onChange={() => onAnswerChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    ) : (
      <textarea
        className="input min-h-40"
        placeholder={question.starterCode || "Explain your approach or paste code here"}
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
      />
    )}
  </div>
);

export default QuestionCard;
