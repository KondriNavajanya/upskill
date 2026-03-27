import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";
import CodeEditorComponent from "../components/CodeEditor";
import { getProblemById, runCode, submitCode, getCodeReview } from "../services/problemService";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [codeReview, setCodeReview] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      const data = await getProblemById(id);
      setProblem(data);
      setCode(data.starterCode?.[language] || "");
      setLoading(false);
    } catch (error) {
      console.error("Failed to load problem:", error);
      setLoading(false);
    }
  };

  const handleRun = async (code, lang, input) => {
    setIsRunning(true);
    setShowOutput(true);
    try {
      const result = await runCode(code, lang, input);
      setOutput(result.output || result.error);
    } catch (error) {
      setOutput("Error running code: " + error.message);
    }
    setIsRunning(false);
  };

  const handleSubmit = async (code, lang) => {
    setIsRunning(true);
    setShowOutput(true);
    try {
      const result = await submitCode(id, code, lang);
      setVerdict(result.verdict);
      if (result.verdict.status === "Accepted") {
        setOutput("🎉 Accepted! " + result.verdict.passedTestCases + "/" + result.verdict.totalTestCases + " test cases passed");
      } else {
        setOutput("Failed: " + result.verdict.passedTestCases + "/" + result.verdict.totalTestCases + " test cases passed");
      }
    } catch (error) {
      setOutput("Error submitting code: " + error.message);
    }
    setIsRunning(false);
  };

  const handleCodeReview = async () => {
    try {
      const review = await getCodeReview(code, language, id);
      setCodeReview(review);
      setActiveTab("review");
    } catch (error) {
      console.error("Failed to get code review:", error);
    }
  };

  if (loading) {
    return <div className="glass-card p-6">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="glass-card p-6">Problem not found</div>;
  }

  const difficultyColor = {
    Easy: "text-green-600 dark:text-green-400",
    Medium: "text-yellow-600 dark:text-yellow-400",
    Hard: "text-red-600 dark:text-red-400"
  };

  const constraintsList = Array.isArray(problem.constraints)
    ? problem.constraints
    : String(problem.constraints || "")
        .split("\n")
        .map((constraint) => constraint.trim())
        .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Problem Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {problem.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`text-lg font-semibold ${difficultyColor[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <div className="flex gap-2">
                {problem.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-200 px-3 py-1 text-xs dark:bg-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="btn-secondary"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        {/* Problem Description */}
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-0">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 px-4 py-3 text-sm font-semibold ${
                  activeTab === "description"
                    ? "border-b-2 border-accent-600 text-accent-600"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("examples")}
                className={`flex-1 px-4 py-3 text-sm font-semibold ${
                  activeTab === "examples"
                    ? "border-b-2 border-accent-600 text-accent-600"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Examples
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`flex-1 px-4 py-3 text-sm font-semibold ${
                  activeTab === "review"
                    ? "border-b-2 border-accent-600 text-accent-600"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Review
              </button>
            </div>
          </div>

          <div className="max-h-[600px] overflow-auto p-4">
            {activeTab === "description" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Description</h3>
                  <p className="mt-2 text-slate-700 dark:text-slate-300">
                    {problem.description}
                  </p>
                </div>

                {constraintsList.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Constraints</h3>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {constraintsList.map((constraint, i) => (
                        <li key={i}>• {constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "examples" && (
              <div className="space-y-4">
                {problem.examples?.map((example, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Example {i + 1}
                    </p>
                    <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-700 dark:text-slate-300">
                      Input: {example.input}
                      {"\n"}Output: {example.output}
                      {example.explanation && `\nExplanation: ${example.explanation}`}
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "review" && codeReview && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Time Complexity: {codeReview.timeComplexity}</h3>
                  <h3 className="font-semibold">Space Complexity: {codeReview.spaceComplexity}</h3>
                </div>
                <div>
                  <h4 className="font-semibold">Improvements:</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {codeReview.improvements?.map((imp, i) => (
                      <li key={i}>• {imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div>
          <CodeEditorComponent
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            output={output}
            showOutput={showOutput}
          />
          {verdict && (
            <div className="mt-4 glass-card p-4">
              <p
                className={`font-semibold ${
                  verdict.status === "Accepted"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {verdict.status}
              </p>
              <button
                onClick={handleCodeReview}
                className="btn-secondary mt-3"
              >
                Get Code Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
