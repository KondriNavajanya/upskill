/**
 * Structured args + comparison hints for Coding Lab Run/Submit (DSA problems).
 * Merged into problems at runtime so leetcodeProblems.js stays readable.
 */
export const CODING_EXECUTION_META = {
  1: {
    entryFunction: "twoSum",
    kind: "default",
    compare: "json",
    testCases: [
      { input: "[2,7,11,15],9", expected: "[0,1]", args: [[2, 7, 11, 15], 9] },
      { input: "[3,2,4],6", expected: "[1,2]", args: [[3, 2, 4], 6] },
      { input: "[3,3],6", expected: "[0,1]", args: [[3, 3], 6] }
    ]
  },
  2: {
    entryFunction: "reverseString",
    kind: "mutate_first",
    compare: "json",
    testCases: [
      {
        input: `["h","e","l","l","o"]`,
        expected: `["o","l","l","e","h"]`,
        args: [["h", "e", "l", "l", "o"]]
      }
    ]
  },
  3: {
    entryFunction: "isPalindrome",
    kind: "default",
    compare: "bool",
    testCases: [
      { input: `"A man, a plan, a canal: Panama"`, expected: "true", args: ["A man, a plan, a canal: Panama"] }
    ]
  },
  4: {
    entryFunction: "maxSubArray",
    kind: "default",
    compare: "number",
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6", args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]] },
      { input: "[5]", expected: "5", args: [[5]] }
    ]
  },
  5: {
    entryFunction: "containsDuplicate",
    kind: "default",
    compare: "bool",
    testCases: [
      { input: "[1,2,3,1]", expected: "true", args: [[1, 2, 3, 1]] },
      { input: "[1,2,3,4]", expected: "false", args: [[1, 2, 3, 4]] }
    ]
  },
  101: {
    entryFunction: "threeSum",
    kind: "default",
    compare: "three_sum",
    testCases: [{ input: "[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]", args: [[-1, 0, 1, 2, -1, -4]] }]
  },
  102: {
    entryFunction: "lengthOfLongestSubstring",
    kind: "default",
    compare: "number",
    testCases: [
      { input: `"abcabcbb"`, expected: "3", args: ["abcabcbb"] },
      { input: `"bbbbb"`, expected: "1", args: ["bbbbb"] },
      { input: `"pwwkew"`, expected: "3", args: ["pwwkew"] }
    ]
  },
  103: {
    entryFunction: "merge",
    kind: "default",
    compare: "json",
    testCases: [
      {
        input: "[[1,3],[2,6],[8,10],[15,18]]",
        expected: "[[1,6],[8,10],[15,18]]",
        args: [[[1, 3], [2, 6], [8, 10], [15, 18]]]
      }
    ]
  },
  201: {
    entryFunction: "findMedianSortedArrays",
    kind: "default",
    compare: "float",
    testCases: [{ input: "[1,3],[2]", expected: "2.0", args: [[1, 3], [2]] }]
  },
  202: {
    entryFunction: "longestPalindrome",
    kind: "default",
    compare: "palindrome_choice",
    testCases: [
      { input: `"babad"`, expected: `"bab" or "aba"`, args: ["babad"] },
      { input: `"ac"`, expected: `"a" or "c"`, args: ["ac"] }
    ]
  }
};

export function applyExecutionMeta(problem) {
  const meta = CODING_EXECUTION_META[problem.id];
  if (!meta) return problem;
  return {
    ...problem,
    entryFunction: meta.entryFunction,
    executionKind: meta.kind,
    compare: meta.compare,
    testCases: meta.testCases
  };
}
