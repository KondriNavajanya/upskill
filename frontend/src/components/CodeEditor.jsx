import { useState } from "react";
import { Play, Send, Eye, EyeOff } from "lucide-react";

const CodeEditorComponent = ({ 
  code, 
  setCode, 
  language, 
  setLanguage, 
  onRun, 
  onSubmit,
  isRunning,
  output,
  showOutput 
}) => {
  const [testInput, setTestInput] = useState("");
  const [showTestInput, setShowTestInput] = useState(false);

  const languageExamples = {
    javascript: 'function solution(nums) {\n  // Write your code here\n  return nums;\n}',
    python: 'def solution(nums):\n    # Write your code here\n    return nums',
    cpp: '#include <vector>\nusing namespace std;\n\nvector<int> solution(vector<int> nums) {\n    // Write your code here\n    return nums;\n}'
  };

  return (
    <div className="glass-card flex h-[600px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold dark:bg-slate-800"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => setShowTestInput(!showTestInput)}
            className="btn-secondary flex items-center gap-2"
          >
            {showTestInput ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Test Input
          </button>
          <button
            onClick={() => onRun(code, language, testInput)}
            disabled={isRunning}
            className="btn-primary flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Run"}
          </button>
          <button
            onClick={() => onSubmit(code, language)}
            disabled={isRunning}
            className="btn-primary flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Submit
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 overflow-hidden border-r border-slate-200 dark:border-slate-700">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-full w-full resize-none bg-slate-900 p-4 font-mono text-sm text-slate-50 outline-none"
            style={{ fontFamily: "Menlo, Monaco, monospace" }}
            spellCheck="false"
          />
        </div>

        {/* Output Panel */}
        <div className="w-80 overflow-hidden border-l border-slate-200 dark:border-slate-700">
          <div className="flex h-full flex-col">
            {showTestInput && (
              <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                <label className="text-sm font-semibold">Test Input:</label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter test input..."
                  className="input mt-2 h-24 resize-none"
                />
              </div>
            )}

            {showOutput && (
              <div className="flex-1 overflow-auto p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Output:</h4>
                <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                  {output || "No output yet"}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Helper */}
      <div className="border-t border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        <button
          onClick={() => setCode(languageExamples[language])}
          className="text-accent-600 hover:underline dark:text-accent-400"
        >
          Load Template
        </button>
      </div>
    </div>
  );
};

export default CodeEditorComponent;
