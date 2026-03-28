import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Play, BookOpen, Sparkles } from "lucide-react";
import api from "../services/api";

const CodingEditor = () => {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const location = useLocation();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [result, setResult] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [userData, setUserData] = useState(null);

  const languages = [
    "JavaScript",
    "Python",
    "TypeScript",
    "Java",
    "C++",
    "C",
    "C#",
    "Go",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Rust",
    "Dart",
    "Scala",
    "Perl",
    "Lua",
    "Haskell",
    "Elixir"
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/coding/problem/${problemId}`);
      setProblem(response.data.problem);
      const initialLang = "JavaScript";
      const tpl = response.data.problem.templates?.[initialLang];
      setLanguage(initialLang);
      setCode(tpl || response.data.problem.templates?.Python || "");
    } catch (error) {
      console.error("Error fetching problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiExplanation = async () => {
    try {
      setExplaining(true);
      const response = await api.post("/coding/explanation/learn", {
        problemId: parseInt(problemId, 10),
        code,
        language
      });
      setExplanation(response.data.explanation);
      setShowExplanation(true);
    } catch (error) {
      console.error("Error fetching explanation:", error);
      alert(
        error.response?.data?.message ||
          "Could not load explanation. Check that the backend is running and OPENAI_API_KEY is set for AI mode."
      );
    } finally {
      setExplaining(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const tpl = problem?.templates?.[newLanguage];
    if (tpl) {
      setCode(tpl);
    } else {
      setCode(
        `// No built-in starter for ${newLanguage} on this problem.\n// Implement the same function names as in the statement (see Python/JS tabs for signatures).\n// Judge0 (${newLanguage}) requires JUDGE0_API_KEY on the server (JavaScript runs locally without it).`
      );
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      alert("Please write some code first.");
      return;
    }
    try {
      setRunning(true);
      setRunResult(null);
      const response = await api.post("/coding/run", {
        problemId: parseInt(problemId, 10),
        language,
        code
      });
      const data = response.data;
      setRunResult(data);
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        runnable: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.hint ||
          error.message ||
          "Run failed."
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please write some code first.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/coding/submit", {
        userId: userData?.id || userData?._id,
        problemId: parseInt(problemId, 10),
        language,
        code,
        topic: location.state?.topic,
        difficulty: location.state?.difficulty
      });

      setResult(response.data.result);
    } catch (error) {
      console.error("Error submitting code:", error);
      alert("Error submitting code: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Problem not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => navigate("/coding")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all shrink-0"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 truncate">{problem.title}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    problem.difficulty === "Easy"
                      ? "text-green-600 bg-green-50"
                      : problem.difficulty === "Medium"
                        ? "text-yellow-600 bg-yellow-50"
                        : "text-red-600 bg-red-50"
                  }`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-sm text-slate-600">{problem.topic}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchAiExplanation}
            disabled={explaining}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-5 h-5" />
            {explaining ? "Preparing explanation..." : "Get explanation"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[calc(100vh-140px)]">
        <div className="bg-white rounded-lg shadow-md overflow-y-auto min-h-[280px]">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Problem Description</h2>
            <p className="text-slate-700 mb-6 whitespace-pre-wrap">{problem.description}</p>

            {problem.examples && problem.examples.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Examples</h3>
                <div className="space-y-4">
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="font-mono text-sm mb-2">
                        <div className="text-slate-600">
                          <span className="font-semibold">Input:</span> {example.input}
                        </div>
                        <div className="text-slate-600 mt-1">
                          <span className="font-semibold">Output:</span> {example.output}
                        </div>
                      </div>
                      {example.explanation && (
                        <div className="text-slate-600 text-sm">
                          <span className="font-semibold">Explanation:</span> {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {problem.constraints && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Constraints</h3>
                <p className="text-slate-600">{problem.constraints}</p>
              </div>
            )}

            {problem.hints && problem.hints.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Hints</h3>
                <ul className="space-y-2">
                  {problem.hints.map((hint, idx) => (
                    <li key={idx} className="text-slate-600 flex gap-3">
                      <span className="font-semibold text-blue-600 shrink-0">💡</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-6 text-sm text-slate-500 border-t border-slate-100 pt-4">
              <strong>Run</strong> uses the first sample test; <strong>Submit</strong> runs all tests.{" "}
              <strong>JavaScript</strong> and <strong>Python</strong> are graded on this machine (no API key)
              if Python 3 is installed and on your PATH. Other languages use Judge0 when{" "}
              <code className="text-xs bg-slate-100 px-1 rounded">JUDGE0_API_KEY</code> is set in the backend{" "}
              <code className="text-xs bg-slate-100 px-1 rounded">.env</code>. C (Judge0/local) supports Two Sum
              only in the polyglot harness.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-[320px]">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Language</h3>
            <div className="flex gap-2 flex-wrap">
              {languages.map((lang) => (
                <button
                  type="button"
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    language === lang
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-1 min-h-[220px]">
            <div className="bg-slate-900 text-white p-3 flex flex-wrap items-center gap-2 justify-between">
              <span className="text-sm font-semibold">Code Editor</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={running}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 px-4 py-2 rounded font-semibold transition-all text-slate-900"
                >
                  <Play className="w-4 h-4" />
                  {running ? "Running..." : "Run"}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 px-4 py-2 rounded font-semibold transition-all"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 min-h-[240px] p-4 font-mono text-sm bg-slate-900 text-slate-100 resize-none focus:outline-none"
              placeholder="Write your code here..."
              spellCheck="false"
            />
          </div>

          {runResult && (
            <div
              className={`rounded-lg shadow-md p-4 border-l-4 bg-white ${
                runResult.passed ? "border-green-500" : runResult.runnable === false ? "border-amber-500" : "border-red-400"
              }`}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">Run (sample test)</h3>
              {runResult.runnable === false && runResult.message && (
                <p className="text-sm text-amber-800 whitespace-pre-wrap">{runResult.message}</p>
              )}
              {runResult.output &&
                (runResult.runnable !== false || runResult.output !== runResult.message) && (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{runResult.output}</p>
                )}
              {runResult.details?.[0] && runResult.runnable && (
                <pre className="mt-2 text-xs bg-slate-50 p-2 rounded overflow-x-auto text-slate-600">
                  {JSON.stringify(runResult.details[0], null, 2)}
                </pre>
              )}
            </div>
          )}

          {result && (
            <div
              className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                result.passed ? "border-green-500" : "border-red-500"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-lg font-bold ${result.passed ? "text-green-600" : "text-red-600"}`}
                >
                  {result.passed ? "✅ Accepted!" : "❌ Not Accepted"}
                </h3>
                <span
                  className={`text-2xl font-bold ${result.passed ? "text-green-600" : "text-red-600"}`}
                >
                  {result.score}%
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <div>
                  Tests passed: {result.testsPassed}/{result.totalTests}
                </div>
                {result.message && !result.passed && (
                  <div className="text-amber-800">{result.message}</div>
                )}
                {(result.timeComplexity || result.spaceComplexity) && (
                  <>
                    <div>Reference time (approach 1): {result.timeComplexity || "N/A"}</div>
                    <div>Reference space: {result.spaceComplexity || "N/A"}</div>
                  </>
                )}
              </div>
              {result.details && result.details.length > 0 && (
                <ul className="mt-3 text-xs text-slate-600 space-y-1 max-h-40 overflow-y-auto">
                  {result.details.map((d, i) => (
                    <li key={i}>
                      Case {i + 1}: {d.passed ? "✓" : "✗"}
                      {d.error ? ` — ${d.error}` : ""}
                      {d.detail ? ` — ${d.detail}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {showExplanation && explanation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 flex items-start justify-between gap-4 z-10">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-90 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Study guide
                  {explanation.source === "ai" && " · AI tutor"}
                  {explanation.source === "static" && " · Offline summary"}
                </p>
                <h2 className="text-2xl font-bold mt-1">{explanation.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanation(false)}
                className="text-2xl font-bold hover:opacity-80 leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-8 text-slate-800">
              <section className="border-l-4 border-indigo-500 bg-indigo-50/80 p-4 rounded-r-lg">
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Core idea (beginner)</h3>
                <p className="leading-relaxed">{explanation.coreIdeaBeginner}</p>
              </section>

              {explanation.approaches?.length > 0 && (
                <section>
                  <h3 className="font-bold text-slate-900 mb-4 text-lg">
                    Different ways to solve it
                  </h3>
                  <div className="space-y-4">
                    {explanation.approaches.map((approach, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2"
                      >
                        <h4 className="font-semibold text-indigo-700 text-lg">{approach.name}</h4>
                        <p className="text-slate-700">{approach.intuition}</p>
                        {approach.steps?.length > 0 && (
                          <ol className="list-decimal list-inside text-sm space-y-1 text-slate-600">
                            {approach.steps.map((s, j) => (
                              <li key={j}>{s}</li>
                            ))}
                          </ol>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs pt-2">
                          <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded">
                            Best time: {approach.timeBest || "—"}
                          </span>
                          <span className="bg-orange-100 text-orange-900 px-2 py-1 rounded">
                            Worst time: {approach.timeWorst || approach.timeBest || "—"}
                          </span>
                          <span className="bg-slate-200 px-2 py-1 rounded">
                            Average: {approach.timeAverage || approach.timeBest || "—"}
                          </span>
                          <span className="bg-emerald-100 text-emerald-900 px-2 py-1 rounded">
                            Space: {approach.space || "—"}
                          </span>
                        </div>
                        {approach.whenToUse && (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">When to use:</span> {approach.whenToUse}
                          </p>
                        )}
                        {approach.pros?.length > 0 && (
                          <p className="text-sm">
                            <span className="font-medium text-green-700">Pros:</span>{" "}
                            {approach.pros.join(" ")}
                          </p>
                        )}
                        {approach.cons?.length > 0 && (
                          <p className="text-sm">
                            <span className="font-medium text-red-700">Cons:</span>{" "}
                            {approach.cons.join(" ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {explanation.complexityNarrative && (
                <section className="bg-violet-50 border border-violet-100 rounded-lg p-4 space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg">Time complexity in plain English</h3>
                  <p>
                    <span className="font-semibold text-violet-800">Best case:</span>{" "}
                    {explanation.complexityNarrative.bestCase}
                  </p>
                  <p>
                    <span className="font-semibold text-violet-800">Worst case:</span>{" "}
                    {explanation.complexityNarrative.worstCase}
                  </p>
                  <p>
                    <span className="font-semibold text-violet-800">Average case:</span>{" "}
                    {explanation.complexityNarrative.averageCase}
                  </p>
                </section>
              )}

              {explanation.realWorldExamples?.length > 0 && (
                <section>
                  <h3 className="font-bold text-slate-900 text-lg">Real-world hooks</h3>
                  <ul className="mt-2 space-y-3">
                    {explanation.realWorldExamples.map((ex, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-indigo-500 font-bold shrink-0">{idx + 1}.</span>
                        <div>
                          <p className="font-semibold">{ex.title}</p>
                          <p className="text-slate-600 text-sm leading-relaxed">{ex.analogy}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {explanation.beginnerTips?.length > 0 && (
                <section>
                  <h3 className="font-bold text-slate-900 text-lg">Tips while you practice</h3>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {explanation.beginnerTips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </section>
              )}

              {explanation.commonMistakes?.length > 0 && (
                <section className="border border-amber-200 bg-amber-50/50 rounded-lg p-4">
                  <h3 className="font-bold text-amber-900 text-lg">Common mistakes</h3>
                  <ul className="list-disc list-inside text-amber-900/90 space-y-1 mt-2">
                    {explanation.commonMistakes.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingEditor;
