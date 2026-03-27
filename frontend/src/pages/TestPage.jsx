import { BrainCircuit } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/test/QuestionCard";
import Timer from "../components/test/Timer";
import TopicAutocomplete from "../components/TopicAutocomplete";
import { generateTest, submitTest } from "../services/testService";
import { difficultyOptions } from "../utils/topics";

const TestPage = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState([]);

  const allAnswered = useMemo(() => {
    if (!test) return false;
    return test.questions.every((_, index) => answers[index]);
  }, [answers, test]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const created = await generateTest({ topic, difficulty });
      setTest(created);
      setAnswers({});
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!test) return;

    const payload = {
      testId: test._id,
      answers,
      timeSpent: test.duration,
      bookmarks: bookmarks.map((item) => ({ questionText: item.prompt }))
    };
    const result = await submitTest(payload);
    localStorage.setItem("latestResult", JSON.stringify(result));
    navigate("/results");
  };

  const toggleBookmark = (question) => {
    setBookmarks((prev) =>
      prev.find((item) => item.prompt === question.prompt)
        ? prev.filter((item) => item.prompt !== question.prompt)
        : [...prev, question]
    );
  };

  return (
    <div className="space-y-6">
      <section className="glass-card grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent-600">AI Test Generator</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            Create focused practice sessions by topic and difficulty.
          </h2>
          <div className="mt-6 space-y-4">
            <TopicAutocomplete value={topic} onChange={setTopic} />
            <div className="grid gap-3 sm:grid-cols-3">
              {difficultyOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDifficulty(option)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    difficulty === option
                      ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={handleGenerate} disabled={loading} type="button">
              {loading ? "Generating..." : "Generate AI Test"}
            </button>
          </div>
        </div>
        <div className="rounded-[28px] bg-slate-900 p-6 text-white dark:bg-slate-950">
          <div className="inline-flex rounded-2xl bg-white/10 p-3">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">Smart practice loop</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>1. Pick a topic and level.</p>
            <p>2. Receive MCQs plus one coding-style challenge.</p>
            <p>3. Get instant scoring, explanations, bookmarks, and role guidance.</p>
          </div>
        </div>
      </section>

      {test ? (
        <section className="space-y-4">
          <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {test.topic} • {test.difficulty}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {test.questions.length} questions • bookmark anything worth revisiting
              </p>
            </div>
            <Timer onExpire={handleSubmit} seconds={test.duration} />
          </div>

          {test.questions.map((question, index) => (
            <QuestionCard
              key={`${question.prompt}-${index}`}
              index={index}
              question={question}
              answer={answers[index] || ""}
              onAnswerChange={(value) => setAnswers((prev) => ({ ...prev, [index]: value }))}
              onToggleBookmark={toggleBookmark}
              bookmarked={Boolean(bookmarks.find((item) => item.prompt === question.prompt))}
            />
          ))}

          <button className="btn-primary" onClick={handleSubmit} disabled={!allAnswered} type="button">
            Submit Test
          </button>
        </section>
      ) : null}
    </div>
  );
};

export default TestPage;
