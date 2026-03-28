import vm from "vm";
import axios from "axios";
import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { buildPolyglotHarness, usesJsonStdin } from "./judge0PolyglotHarness.js";
import { encodePlainStdin } from "./plainCodingArgs.js";
import { getJudge0LanguageId } from "./judge0Languages.js";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "demo-key";

const PYTHON_JUDGE0_ID = 71;

function normalizeTriplet(t) {
  return [...t].sort((a, b) => a - b);
}

function normalizeThreeSum(actual) {
  if (!Array.isArray(actual)) return null;
  return [...actual].map(normalizeTriplet).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}

function parseExpectedThreeSum(str) {
  try {
    const parsed = JSON.parse(str.replace(/'/g, '"'));
    return normalizeThreeSum(parsed);
  } catch {
    return null;
  }
}

/** Normalize LeetCode-style outputs for comparison. */
function coerceToJsonComparable(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === "number") {
    if (Number.isNaN(val)) return val;
    if (Number.isInteger(val)) return val;
    return Math.round(val * 1e9) / 1e9;
  }
  if (typeof val === "boolean" || typeof val === "string") return val;
  if (ArrayBuffer.isView(val)) return Array.from(val);
  if (Array.isArray(val)) return val.map(coerceToJsonComparable);
  return val;
}

function parseExpectedJsonString(s) {
  const t = String(s).trim();
  try {
    return JSON.parse(t.replace(/'/g, '"'));
  } catch {
    try {
      return JSON.parse(t);
    } catch {
      return null;
    }
  }
}

function deepEqualGrader(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) {
    if (typeof a === "number" && typeof b === "number") {
      return Math.abs(a - b) < 1e-9;
    }
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqualGrader(a[i], b[i])) return false;
    }
    return true;
  }
  return false;
}

function compareResults(problemId, compare, actual, expectedStr, args) {
  if (actual === undefined) {
    return { passed: false, detail: "Your function returned undefined." };
  }

  if (compare === "json") {
    const exp = expectedStr.trim();
    const expVal = parseExpectedJsonString(exp);
    let actVal =
      typeof actual === "string"
        ? parseExpectedJsonString(actual.trim()) ?? actual
        : actual;
    actVal = coerceToJsonComparable(actVal);
    let passed = expVal !== null && deepEqualGrader(actVal, coerceToJsonComparable(expVal));
    if (!passed) {
      const normStr = (x) => {
        try {
          return JSON.stringify(JSON.parse(String(x).trim().replace(/'/g, '"')));
        } catch {
          return String(x).replace(/\s+/g, "");
        }
      };
      const aStr =
        typeof actual === "object" && actual !== null
          ? JSON.stringify(actVal)
          : String(actual).trim();
      passed = normStr(aStr) === normStr(exp);
    }
    const display =
      typeof actual === "object" && actual !== null ? JSON.stringify(actVal) : String(actual);
    return { passed, actual: display, expected: exp };
  }

  if (compare === "bool") {
    const e = expectedStr.trim().toLowerCase() === "true";
    const a =
      actual === true || actual === false ? actual : String(actual).trim().toLowerCase() === "true";
    return { passed: a === e, actual: actual, expected: expectedStr };
  }

  if (compare === "number") {
    const e = Number(String(expectedStr).trim());
    const a = Number(actual);
    const passed =
      !Number.isNaN(a) && !Number.isNaN(e) && (a === e || Math.abs(a - e) < 1e-9);
    return { passed, actual, expected: e };
  }

  if (compare === "float") {
    const e = parseFloat(expectedStr, 10);
    const a = typeof actual === "number" ? actual : parseFloat(actual, 10);
    const passed = Number.isFinite(a) && Math.abs(a - e) < 1e-5;
    return { passed, actual: a, expected: e };
  }

  if (compare === "three_sum") {
    const exp = parseExpectedThreeSum(expectedStr);
    const got = normalizeThreeSum(actual);
    if (!exp || !got || exp.length !== got.length) {
      return { passed: false, actual: got, expected: exp };
    }
    const key = (t) => t.join(",");
    const expSet = new Set(exp.map(key));
    const passed = got.every((t) => expSet.has(key(t)));
    return { passed, actual: got, expected: exp };
  }

  if (compare === "palindrome_choice") {
    const s = args?.[0] ?? "";
    if (typeof actual !== "string" || !actual.length) {
      return { passed: false, detail: "Expected non-empty string result." };
    }
    const reversed = [...actual].reverse().join("");
    if (actual !== reversed) {
      return { passed: false, detail: "Result is not a palindrome." };
    }
    let sub = false;
    for (let i = 0; i <= s.length - actual.length; i++) {
      if (s.slice(i, i + actual.length) === actual) {
        sub = true;
        break;
      }
    }
    if (!sub) {
      return { passed: false, detail: "Result must be a contiguous substring of the input." };
    }
    const options = [...expectedStr.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    const passed = options.length === 0 || options.includes(actual);
    return { passed, actual, expected: expectedStr };
  }

  return { passed: false, detail: "Unknown compare mode." };
}

function runUserFunctionInVm(userCode, entryFunction, args, kind) {
  const sandbox = {
    console,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Map,
    Set,
    Math,
    parseInt,
    parseFloat,
    isNaN,
    Infinity
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  /* const/let at top level are not context properties; wrap so entry is always visible (LeetCode-style). */
  const wrapped = `
(function () {
  ${userCode}
  if (typeof ${entryFunction} === "function") {
    globalThis.__judgeEntry = ${entryFunction};
  }
})();
`;
  vm.runInContext(wrapped, sandbox, { timeout: 8000 });
  const fn = sandbox.__judgeEntry || sandbox[entryFunction];
  if (typeof fn !== "function") {
    throw new Error(
      `Could not find function "${entryFunction}". Use the starter name (e.g. var twoSum = function(...) or const ${entryFunction} = (...)` +
        ` => ...). class Solution is not supported in local JS grading.`
    );
  }
  if (kind === "mutate_first") {
    const arg0 = typeof args[0] === "object" && args[0] !== null ? JSON.parse(JSON.stringify(args[0])) : args[0];
    const a0 = Array.isArray(arg0) ? [...arg0] : arg0;
    fn(a0);
    return a0;
  }
  return fn(...args);
}

export function runJavaScriptTests(problem, userCode, { onlyFirst = false } = {}) {
  const { entryFunction, executionKind = "default", compare = "json", testCases = [] } = problem;
  if (!entryFunction || !testCases.length) {
    return {
      runnable: false,
      message: "This challenge has no automated tests yet. Try JavaScript or Python on DSA problems, or write code and use Get explanation."
    };
  }

  const cases = onlyFirst ? testCases.slice(0, 1) : testCases;
  const details = [];
  let passedCount = 0;

  for (const tc of cases) {
    if (!tc.args) {
      details.push({ passed: false, error: "Missing test metadata." });
      continue;
    }
    try {
      const actual = runUserFunctionInVm(userCode, entryFunction, tc.args, executionKind);
      const { passed, actual: actOut, expected, detail } = compareResults(
        problem.id,
        executionKind === "mutate_first" ? "json" : compare,
        actual,
        tc.expected,
        tc.args
      );
      if (passed) passedCount++;
      details.push({
        passed,
        input: tc.input,
        expected: tc.expected,
        actual: actOut ?? actual,
        detail
      });
    } catch (e) {
      details.push({ passed: false, input: tc.input, error: e.message });
    }
  }

  const total = cases.length;
  return {
    runnable: true,
    passed: passedCount === total && total > 0,
    testsPassed: passedCount,
    totalTests: total,
    details,
    mode: onlyFirst ? "run" : "submit"
  };
}

function buildPythonHarness(userCode, entryFunction, kind) {
  if (kind === "mutate_first") {
    return `
import json
import sys

${userCode}

if __name__ == "__main__":
    data = json.loads(sys.stdin.read())
    s = list(data[0])
    ${entryFunction}(s)
    print(json.dumps(s))
`;
  }
  return `
import json
import sys

${userCode}

if __name__ == "__main__":
    args = json.loads(sys.stdin.read())
    result = ${entryFunction}(*args)
    if isinstance(result, bool):
        print('true' if result else 'false')
    elif isinstance(result, (int, float)):
        print(result)
    elif isinstance(result, list):
        print(json.dumps(result))
    elif result is None:
        print('null')
    else:
        print(result)
`;
}

async function judge0Submit(sourceCode, stdin, languageId = PYTHON_JUDGE0_ID) {
  const response = await axios.post(
    `${JUDGE0_API_URL}/submissions`,
    {
      source_code: sourceCode,
      language_id: languageId,
      stdin
    },
    {
      headers: {
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
      }
    }
  );

  const token = response.data.token;
  const pending = new Set([1, 2]);
  let result = null;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const resultResponse = await axios.get(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`,
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }
      }
    );
    result = resultResponse.data;
    const st = result.status;
    const sid = typeof st?.id === "number" ? st.id : result.status_id;
    if (typeof sid !== "number") {
      continue;
    }
    if (!pending.has(sid)) {
      break;
    }
  }
  return result;
}

let cachedPythonRunner;

function detectPythonRunner() {
  if (process.env.PYTHON_EXECUTABLE) {
    const cmd = process.env.PYTHON_EXECUTABLE;
    const r = spawnSync(cmd, ["-c", "print(1)"], {
      encoding: "utf8",
      timeout: 12000,
      windowsHide: true
    });
    if (r.status === 0) {
      return { cmd, prefix: [] };
    }
  }
  const tries = [
    ["python", []],
    ["python3", []],
    ["py", ["-3"]],
    ["py", []]
  ];
  for (const [cmd, prefix] of tries) {
    const r = spawnSync(cmd, [...prefix, "-c", "print(1)"], {
      encoding: "utf8",
      timeout: 12000,
      windowsHide: true
    });
    if (r.status === 0) {
      return { cmd, prefix };
    }
  }
  return null;
}

function getPythonRunner() {
  if (cachedPythonRunner === undefined) {
    cachedPythonRunner = detectPythonRunner();
  }
  return cachedPythonRunner;
}

function runPythonHarnessOnDisk(harness, stdin) {
  const runner = getPythonRunner();
  if (!runner) {
    return { ok: false, error: "NO_PYTHON" };
  }
  const tmp = path.join(
    os.tmpdir(),
    `coding_lab_${process.pid}_${Date.now()}_${Math.random().toString(36).slice(2)}.py`
  );
  try {
    fs.writeFileSync(tmp, harness, "utf8");
    const res = spawnSync(runner.cmd, [...runner.prefix, tmp], {
      input: stdin,
      encoding: "utf8",
      timeout: 15000,
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024
    });
    if (res.status !== 0) {
      const msg = (res.stderr || res.stdout || `Exit code ${res.status}`).trim();
      return { ok: false, error: msg || "Python exited with an error." };
    }
    return { ok: true, out: (res.stdout || "").trim() };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

function parsePythonStdoutLine(out, compare) {
  let actual;
  if (compare === "bool") {
    actual = out === "true";
  } else if (compare === "number" || compare === "float") {
    actual = compare === "float" ? parseFloat(out, 10) : parseInt(out, 10);
  } else if (compare === "three_sum") {
    actual = JSON.parse(out);
  } else if (compare === "palindrome_choice") {
    actual = out.replace(/^"|"$/g, "");
  } else {
    try {
      actual = JSON.parse(out);
    } catch {
      actual = out;
    }
  }
  return actual;
}

export async function runPythonTests(problem, userCode, { onlyFirst = false } = {}) {
  const { entryFunction, executionKind = "default", compare, testCases = [] } = problem;
  if (!entryFunction || !testCases.length) {
    return { runnable: false, message: "No automated tests for this problem." };
  }

  const useJudge0 = Boolean(JUDGE0_API_KEY && JUDGE0_API_KEY !== "demo-key");
  if (!useJudge0 && !getPythonRunner()) {
    return {
      runnable: false,
      message:
        "Python is not available on this machine (install Python 3 and add `python` or `py` to PATH), or set JUDGE0_API_KEY in backend .env for cloud runs. JavaScript is always graded locally.",
      testsPassed: 0,
      totalTests: 0,
      details: []
    };
  }

  const harness = buildPythonHarness(userCode, entryFunction, executionKind);
  const cases = onlyFirst ? testCases.slice(0, 1) : testCases;
  const details = [];
  let passedCount = 0;

  for (const tc of cases) {
    if (!tc.args) {
      details.push({ passed: false, error: "Missing test metadata." });
      continue;
    }
    try {
      const stdin = JSON.stringify(tc.args);
      let out;

      if (useJudge0) {
        const raw = await judge0Submit(harness, stdin, PYTHON_JUDGE0_ID);
        const status = raw.status?.description;
        if (status && status !== "Accepted") {
          const err = Buffer.from(raw.stderr || "", "base64").toString();
          details.push({ passed: false, input: tc.input, error: err || status });
          continue;
        }
        out = Buffer.from(raw.stdout || "", "base64").toString().trim();
      } else {
        const loc = runPythonHarnessOnDisk(harness, stdin);
        if (!loc.ok) {
          details.push({ passed: false, input: tc.input, error: loc.error });
          continue;
        }
        out = loc.out;
      }

      const actual = parsePythonStdoutLine(out, compare);
      const { passed, actual: actOut, detail } = compareResults(
        problem.id,
        executionKind === "mutate_first" ? "json" : compare,
        actual,
        tc.expected,
        tc.args
      );
      if (passed) passedCount++;
      details.push({
        passed,
        input: tc.input,
        expected: tc.expected,
        actual: actOut ?? actual,
        detail
      });
    } catch (e) {
      details.push({ passed: false, input: tc.input, error: e.message });
    }
  }

  const total = cases.length;
  return {
    runnable: true,
    passed: passedCount === total && total > 0,
    testsPassed: passedCount,
    totalTests: total,
    details,
    mode: onlyFirst ? "run" : "submit"
  };
}

function parseActualFromStdout(out, compare, executionKind) {
  let actual;
  if (compare === "bool") {
    actual = out === "true";
  } else if (compare === "number" || compare === "float") {
    actual = compare === "float" ? parseFloat(out, 10) : parseInt(out, 10);
  } else if (compare === "three_sum") {
    actual = JSON.parse(out);
  } else if (compare === "palindrome_choice") {
    actual = out.replace(/^"|"$/g, "");
  } else {
    try {
      actual = JSON.parse(out);
    } catch {
      actual = out;
    }
  }
  return actual;
}

export async function runPolyglotJudge0Tests(problem, userCode, langNormalized, { onlyFirst = false } = {}) {
  const { executionKind = "default", compare, testCases = [] } = problem;
  if (!testCases.length) {
    return { runnable: false, message: "No automated tests for this problem." };
  }
  if (!JUDGE0_API_KEY || JUDGE0_API_KEY === "demo-key") {
    return {
      runnable: false,
      message:
        "Set JUDGE0_API_KEY in backend .env for this language on Judge0. JavaScript and Python (if installed) run locally without it."
    };
  }

  const langId = getJudge0LanguageId(langNormalized);
  if (!langId) {
    return {
      runnable: false,
      message: `Language "${langNormalized}" is not mapped to Judge0. Choose another language or extend judge0Languages.js.`
    };
  }

  const harness = buildPolyglotHarness(langNormalized, problem, userCode);
  if (!harness) {
    return {
      runnable: false,
      message: `No harness for ${langNormalized} on this problem yet. Try JavaScript (all problems), Python, Ruby, Go, PHP, TypeScript, Swift, or Java (Judge0). C is supported for "Two Sum" only.`
    };
  }

  const cases = onlyFirst ? testCases.slice(0, 1) : testCases;
  const details = [];
  let passedCount = 0;

  for (const tc of cases) {
    if (!tc.args) {
      details.push({ passed: false, error: "Missing test metadata." });
      continue;
    }
    let stdin;
    if (usesJsonStdin(langNormalized)) {
      stdin = JSON.stringify(tc.args);
    } else {
      stdin = encodePlainStdin(problem.id, tc.args, executionKind);
      if (stdin == null) {
        details.push({
          passed: false,
          input: tc.input,
          error: "Cannot encode stdin for this language/problem combination."
        });
        continue;
      }
    }

    try {
      const raw = await judge0Submit(harness, stdin, langId);
      const status = raw.status?.description;
      if (status && status !== "Accepted") {
        const err = Buffer.from(raw.stderr || "", "base64").toString();
        const compile = Buffer.from(raw.compile_output || "", "base64").toString();
        details.push({
          passed: false,
          input: tc.input,
          error: (compile || err || status || "").trim() || status
        });
        continue;
      }
      const out = Buffer.from(raw.stdout || "", "base64").toString().trim();
      const actual = parseActualFromStdout(out, compare, executionKind);
      const { passed, actual: actOut, detail } = compareResults(
        problem.id,
        executionKind === "mutate_first" ? "json" : compare,
        actual,
        tc.expected,
        tc.args
      );
      if (passed) passedCount++;
      details.push({
        passed,
        input: tc.input,
        expected: tc.expected,
        actual: actOut ?? actual,
        detail
      });
    } catch (e) {
      details.push({ passed: false, input: tc.input, error: e.message });
    }
  }

  const total = cases.length;
  return {
    runnable: true,
    passed: passedCount === total && total > 0,
    testsPassed: passedCount,
    totalTests: total,
    details,
    mode: onlyFirst ? "run" : "submit"
  };
}

export async function runCodingLabTests(problem, userCode, langNormalized, opts) {
  if (langNormalized === "javascript") {
    return runJavaScriptTests(problem, userCode, opts);
  }
  if (langNormalized === "python") {
    return runPythonTests(problem, userCode, opts);
  }
  return runPolyglotJudge0Tests(problem, userCode, langNormalized, opts);
}

export function normalizeCodingLanguage(lang) {
  const raw = (lang || "").trim().toLowerCase().replace(/\s+/g, "");
  const map = {
    js: "javascript",
    node: "javascript",
    nodejs: "javascript",
    javascript: "javascript",
    ts: "typescript",
    typescript: "typescript",
    py: "python",
    python3: "python",
    python: "python",
    cpp: "cpp",
    "c++": "cpp",
    cxx: "cpp",
    cplusplus: "cpp",
    c: "c",
    cs: "csharp",
    csharp: "csharp",
    "c#": "csharp",
    java: "java",
    kt: "kotlin",
    kotlin: "kotlin",
    go: "go",
    golang: "go",
    rb: "ruby",
    ruby: "ruby",
    php: "php",
    swift: "swift",
    rs: "rust",
    rust: "rust",
    dart: "dart",
    scala: "scala",
    pl: "perl",
    perl: "perl",
    lua: "lua",
    hs: "haskell",
    haskell: "haskell",
    ex: "elixir",
    elixir: "elixir",
    tsx: "typescript"
  };
  return map[raw] || raw;
}
