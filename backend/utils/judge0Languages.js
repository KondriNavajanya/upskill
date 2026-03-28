/** Judge0 CE language ids (see https://ce.judge0.com/languages — align with your host). */
export const JUDGE0_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  typescript: 94,
  java: 91,
  cpp: 54,
  c: 50,
  csharp: 51,
  go: 106,
  ruby: 72,
  php: 98,
  swift: 83,
  kotlin: 111,
  rust: 108,
  dart: 90,
  scala: 112,
  perl: 85,
  lua: 64,
  haskell: 61,
  elixir: 57
};

export function getJudge0LanguageId(lang) {
  if (!lang) return null;
  return JUDGE0_LANGUAGE_IDS[lang] ?? null;
}
