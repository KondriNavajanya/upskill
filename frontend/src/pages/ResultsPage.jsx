import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchHistory } from "../services/testService";
import { formatDate } from "../utils/formatters";

const ResultsPage = () => {
  const [latestResult, setLatestResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("latestResult");
    if (stored) {
      setLatestResult(JSON.parse(stored));
    }

    fetchHistory().then(setHistory);
  }, []);

  return (
    <div className="space-y-6">
      {latestResult ? (
        <section className="glass-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent-600">Latest Result</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {latestResult.topic} • {latestResult.score}%
          </h2>
          <div className="mt-6 grid gap-4">
            {latestResult.answers.map((answer) => (
              <div
                key={answer.question}
                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 text-teal-600" />
                  ) : (
                    <XCircle className="mt-1 h-5 w-5 text-rose-600" />
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{answer.question}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Your answer: {answer.selectedAnswer || "No answer"}
                    </p>
                    {!answer.isCorrect ? (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Correct answer: {answer.correctAnswer}
                      </p>
                    ) : null}
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{answer.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="glass-card p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Test History</h3>
        <div className="mt-4 grid gap-3">
          {history.map((item) => (
            <div
              key={item._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{item.topic}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.difficulty} • {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-accent-600">
                {item.score}%
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultsPage;
