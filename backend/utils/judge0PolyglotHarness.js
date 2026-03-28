import { encodePlainStdin } from "./plainCodingArgs.js";

/**
 * Languages that read JSON array args from stdin (stdlib JSON only).
 */
export const JSON_STDIN_LANGUAGES = new Set(["ruby", "go", "php", "typescript", "swift"]);

export function usesJsonStdin(lang) {
  return JSON_STDIN_LANGUAGES.has(lang);
}

export function buildPolyglotHarness(lang, problem, userCode) {
  const pid = problem.id;
  const kind = problem.executionKind || "default";
  const cmp = problem.compare || "json";

  if (usesJsonStdin(lang)) {
    switch (lang) {
      case "ruby":
        return buildRuby(pid, kind, cmp, userCode);
      case "go":
        return buildGo(pid, kind, cmp, userCode);
      case "php":
        return buildPhp(pid, kind, cmp, userCode);
      case "typescript":
        return buildTypeScript(pid, kind, cmp, userCode);
      case "swift":
        return buildSwiftJson(pid, kind, cmp, userCode);
      default:
        return null;
    }
  }

  switch (lang) {
    case "java":
      return buildJavaPlain(pid, kind, cmp, userCode);
    case "cpp":
      return buildCppPlain(pid, kind, cmp, userCode);
    case "csharp":
      return buildCsharpPlain(pid, kind, cmp, userCode);
    case "kotlin":
      return buildKotlinPlain(pid, kind, cmp, userCode);
    case "c":
      return buildCPlain(pid, kind, cmp, userCode);
    default:
      return null;
  }
}

function rubyPrintRes(varName, cmp) {
  if (cmp === "bool") return `puts ${varName} ? 'true' : 'false'`;
  if (cmp === "number" || cmp === "float") return `puts ${varName}.to_s`;
  if (cmp === "palindrome_choice") return `puts ${varName}.to_s`;
  return `puts JSON.generate(${varName})`;
}

function rubySwitchBody(pid) {
  const cases = {
    1: `when 1
    twoSum(raw[0], raw[1])`,
    2: `when 2
    s = raw[0].map(&:dup)
    reverseString(s)
    s`,
    3: `when 3
    isPalindrome(raw[0])`,
    4: `when 4
    maxSubArray(raw[0])`,
    5: `when 5
    containsDuplicate(raw[0])`,
    101: `when 101
    threeSum(raw[0])`,
    102: `when 102
    lengthOfLongestSubstring(raw[0])`,
    103: `when 103
    merge(raw[0])`,
    201: `when 201
    findMedianSortedArrays(raw[0], raw[1])`,
    202: `when 202
    longestPalindrome(raw[0])`
  };
  return cases[pid] || `when ${pid}\n    raise "No Ruby harness for this problem id"`;
}

function buildRuby(pid, kind, cmp, userCode) {
  return `require 'json'
${userCode}

def _judge_invoke(pid, raw)
  case pid
${rubySwitchBody(pid)}
  else
    raise "Unsupported problem id #{pid} for Ruby harness"
  end
end

raw = JSON.parse(STDIN.read)
res = _judge_invoke(${pid}, raw)
${rubyPrintRes("res", cmp)}
`;
}

function goSwitchBody(pid) {
  const lines = {
    1: `  case 1:
    var nums []int
    json.Unmarshal(raw[0], &nums)
    var target int
    json.Unmarshal(raw[1], &target)
    return twoSum(nums, target)`,
    2: `  case 2:
    var s []string
    json.Unmarshal(raw[0], &s)
    reverseString(s)
    return s`,
    3: `  case 3:
    var s string
    json.Unmarshal(raw[0], &s)
    return isPalindrome(s)`,
    4: `  case 4:
    var nums []int
    json.Unmarshal(raw[0], &nums)
    return maxSubArray(nums)`,
    5: `  case 5:
    var nums []int
    json.Unmarshal(raw[0], &nums)
    return containsDuplicate(nums)`,
    101: `  case 101:
    var nums []int
    json.Unmarshal(raw[0], &nums)
    return threeSum(nums)`,
    102: `  case 102:
    var s string
    json.Unmarshal(raw[0], &s)
    return lengthOfLongestSubstring(s)`,
    103: `  case 103:
    var iv [][]int
    json.Unmarshal(raw[0], &iv)
    return merge(iv)`,
    201: `  case 201:
    var a, b []int
    json.Unmarshal(raw[0], &a)
    json.Unmarshal(raw[1], &b)
    return findMedianSortedArrays(a, b)`,
    202: `  case 202:
    var s string
    json.Unmarshal(raw[0], &s)
    return longestPalindrome(s)`
  };
  return lines[pid] || `  default:\n    panic("no go harness")`;
}

function goPrintBlock(varName, cmp) {
  if (cmp === "bool") {
    return `  switch v := ${varName}.(type) {
  case bool:
    if v {
      fmt.Println("true")
    } else {
      fmt.Println("false")
    }
  default:
    fmt.Println("false")
  }`;
  }
  if (cmp === "number" || cmp === "float") {
    return `  fmt.Printf("%v\\n", ${varName})`;
  }
  if (cmp === "palindrome_choice") {
    return `  fmt.Printf("%s\\n", ${varName})`;
  }
  return `  b, _ := json.Marshal(${varName})
  fmt.Println(string(b))`;
}

function buildGo(pid, kind, cmp, userCode) {
  return `package main

import (
  "encoding/json"
  "fmt"
  "os"
)

${userCode}

func judgeInvoke(pid int, raw []json.RawMessage) interface{} {
  switch pid {
${goSwitchBody(pid)}
  default:
    panic("unsupported problem for Go harness")
  }
}

func main() {
  dec := json.NewDecoder(os.Stdin)
  var raw []json.RawMessage
  if err := dec.Decode(&raw); err != nil {
    panic(err)
  }
  res := judgeInvoke(${pid}, raw)
${goPrintBlock("res", cmp)}
}
`;
}

function phpSwitchFixed(pid) {
  const b = {
    1: "  case 1:\n    $res = twoSum($raw[0], $raw[1]);\n    break;",
    2: "  case 2:\n    $s = $raw[0];\n    reverseString($s);\n    $res = $s;\n    break;",
    3: "  case 3:\n    $res = isPalindrome($raw[0]);\n    break;",
    4: "  case 4:\n    $res = maxSubArray($raw[0]);\n    break;",
    5: "  case 5:\n    $res = containsDuplicate($raw[0]);\n    break;",
    101: "  case 101:\n    $res = threeSum($raw[0]);\n    break;",
    102: "  case 102:\n    $res = lengthOfLongestSubstring($raw[0]);\n    break;",
    103: "  case 103:\n    $res = merge($raw[0]);\n    break;",
    201: "  case 201:\n    $res = findMedianSortedArrays($raw[0], $raw[1]);\n    break;",
    202: "  case 202:\n    $res = longestPalindrome($raw[0]);\n    break;"
  };
  return b[pid] || "  default:\n    fwrite(STDERR, \"unsupported\\n\");\n    exit(2);";
}

function buildPhp(pid, kind, cmp, userCode) {
  return `<?php
${userCode}
$raw = json_decode(stream_get_contents(STDIN), true);
$res = null;
switch (${pid}) {
${phpSwitchFixed(pid)}
}
if ('${cmp}' === 'bool') {
  echo $res ? 'true' : 'false';
} else if ('${cmp}' === 'number' || '${cmp}' === 'float') {
  echo $res;
} else if ('${cmp}' === 'palindrome_choice') {
  echo $res;
} else {
  echo json_encode($res);
}
`;
}

function buildTypeScript(pid, kind, cmp, userCode) {
  const invoke = tsSwitch(pid);
  return `declare function require(m: string): any;
const fs = require('fs');
${userCode}

function judgeInvoke(pid: number, raw: any[]): any {
  switch (pid) {
${invoke}
    default:
      throw new Error('unsupported pid');
  }
}

const raw = JSON.parse(fs.readFileSync(0, 'utf-8')) as any[];
const res = judgeInvoke(${pid}, raw);
${tsPrint("res", cmp)}
`;
}

function tsSwitch(pid) {
  const m = {
    1: `    case 1: return twoSum(raw[0], raw[1]);`,
    2: `    case 2: { const s = [...raw[0]]; reverseString(s); return s; }`,
    3: `    case 3: return isPalindrome(raw[0]);`,
    4: `    case 4: return maxSubArray(raw[0]);`,
    5: `    case 5: return containsDuplicate(raw[0]);`,
    101: `    case 101: return threeSum(raw[0]);`,
    102: `    case 102: return lengthOfLongestSubstring(raw[0]);`,
    103: `    case 103: return merge(raw[0]);`,
    201: `    case 201: return findMedianSortedArrays(raw[0], raw[1]);`,
    202: `    case 202: return longestPalindrome(raw[0]);`
  };
  return m[pid] || `    default: throw new Error('no ts');`;
}

function tsPrint(v, cmp) {
  if (cmp === "bool") return `console.log(${v} ? 'true' : 'false');`;
  if (cmp === "number" || cmp === "float") return `console.log(String(${v}));`;
  if (cmp === "palindrome_choice") return `console.log(${v});`;
  return `console.log(JSON.stringify(${v}));`;
}

function buildSwiftJson(pid, kind, cmp, userCode) {
  const invoke = swiftSwitch(pid);
  return `import Foundation
${userCode}

func judgeInvoke(_ pid: Int, _ raw: [Any]) -> Any {
  switch pid {
${invoke}
  default:
    fatalError("unsupported")
  }
}

let input = String(data: FileHandle.standardInput.readDataToEndOfFile(), encoding: .utf8)!
let data = input.data(using: .utf8)!
let raw = try! JSONSerialization.jsonObject(with: data) as! [Any]
let res = judgeInvoke(${pid}, raw)
${swiftPrint("res", cmp)}
`;
}

function swiftSwitch(pid) {
  const m = {
    1: `  case 1:
    return twoSum(raw[0] as! [Int], raw[1] as! Int)`,
    2: `  case 2:
    var s = raw[0] as! [String]; reverseString(&s); return s`,
    3: `  case 3:
    return isPalindrome(raw[0] as! String)`,
    4: `  case 4:
    return maxSubArray(raw[0] as! [Int])`,
    5: `  case 5:
    return containsDuplicate(raw[0] as! [Int])`,
    101: `  case 101:
    return threeSum(raw[0] as! [Int])`,
    102: `  case 102:
    return lengthOfLongestSubstring(raw[0] as! String)`,
    103: `  case 103:
    return merge(raw[0] as! [[Int]])`,
    201: `  case 201:
    return findMedianSortedArrays(raw[0] as! [Int], raw[1] as! [Int])`,
    202: `  case 202:
    return longestPalindrome(raw[0] as! String)`
  };
  return m[pid] || `  default:\n    fatalError("no swift")`;
}

function swiftPrint(v, cmp) {
  if (cmp === "bool") {
    return `if let b = res as? Bool { print(b ? "true" : "false") }`;
  }
  if (cmp === "number" || cmp === "float") {
    return `print(res)`;
  }
  if (cmp === "palindrome_choice") {
    return `print(res)`;
  }
  return `
if let arr = res as? [[Int]] {
  let data = try! JSONSerialization.data(withJSONObject: arr)
  print(String(data: data, encoding: .utf8)!)
} else if let arr = res as? [Int] {
  let data = try! JSONSerialization.data(withJSONObject: arr)
  print(String(data: data, encoding: .utf8)!)
} else {
  print(res)
}
`;
}

/* ---------- Plain stdin: Java / C++ / C# / Kotlin / C ---------- */

function buildJavaPlain(pid, kind, cmp, userCode) {
  const core = javaPlainSwitch(pid, cmp);
  return `${userCode}

${core}
`;
}

function javaPlainSwitch(pid, cmp) {
  const cases = {
    1: `import java.util.*;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] nums = new int[n];
    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
    int t = sc.nextInt();
    int[] r = new Solution().twoSum(nums, t);
    printIntArr(r);
  }
  static void printIntArr(int[] r) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < r.length; i++) {
      if (i > 0) sb.append(",");
      sb.append(r[i]);
    }
    sb.append("]");
    System.out.println(sb.toString());
  }
}`
  };

  if (cases[pid]) return cases[pid];

  return javaPlainBody(pid, cmp);
}

function javaPlainBody(pid, cmp) {
  /* Problem 1 handled above via cases - actually case 1 key exists */
  const scanners = {
    3: `Scanner sc = new Scanner(System.in);
    String b64 = sc.nextLine();
    byte[] dec = java.util.Base64.getDecoder().decode(b64);
    String s = new String(dec, java.nio.charset.StandardCharsets.UTF_8);
    boolean b = new Solution().isPalindrome(s);
    System.out.println(b ? "true" : "false");`,
    4: `Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] nums = new int[n];
    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
    int x = new Solution().maxSubArray(nums);
    System.out.println(x);`,
    5: `Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] nums = new int[n];
    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
    boolean b = new Solution().containsDuplicate(nums);
    System.out.println(b ? "true" : "false");`,
    101: `Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] nums = new int[n];
    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
    var res = new Solution().threeSum(nums);
    printNestedList(res);`,
    102: `Scanner sc = new Scanner(System.in);
    String b64 = sc.nextLine();
    byte[] dec = java.util.Base64.getDecoder().decode(b64);
    String s = new String(dec, java.nio.charset.StandardCharsets.UTF_8);
    int x = new Solution().lengthOfLongestSubstring(s);
    System.out.println(x);`,
    103: `Scanner sc = new Scanner(System.in);
    int rows = sc.nextInt();
    int[][] iv = new int[rows][];
    for (int r = 0; r < rows; r++) {
      int len = sc.nextInt();
      iv[r] = new int[len];
      for (int c = 0; c < len; c++) iv[r][c] = sc.nextInt();
    }
    var res = new Solution().merge(iv);
    print2D(res);`,
    201: `Scanner sc = new Scanner(System.in);
    int n1 = sc.nextInt();
    int[] a = new int[n1];
    for (int i = 0; i < n1; i++) a[i] = sc.nextInt();
    int n2 = sc.nextInt();
    int[] b = new int[n2];
    for (int i = 0; i < n2; i++) b[i] = sc.nextInt();
    double x = new Solution().findMedianSortedArrays(a, b);
    System.out.println(x);`,
    202: `Scanner sc = new Scanner(System.in);
    String b64 = sc.nextLine();
    byte[] dec = java.util.Base64.getDecoder().decode(b64);
    String s = new String(dec, java.nio.charset.StandardCharsets.UTF_8);
    System.out.println(new Solution().longestPalindrome(s));`,
    2: `Scanner sc = new Scanner(System.in);
    int len = sc.nextInt();
    sc.nextLine();
    String line = sc.nextLine();
    char[] ca = line.toCharArray();
    new Solution().reverseString(ca);
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < ca.length; i++) {
      if (i > 0) sb.append(",");
      sb.append("\\\"").append(ca[i]).append("\\\"");
    }
    sb.append("]");`
  };

  const body =
    scanners[pid] ||
    `throw new RuntimeException("Java plain harness: unsupported problem");`;

  const helpers = `
  static void printNestedList(java.util.List<java.util.List<Integer>> res) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < res.size(); i++) {
      if (i > 0) sb.append(",");
      sb.append("[");
      var row = res.get(i);
      for (int j = 0; j < row.size(); j++) {
        if (j > 0) sb.append(",");
        sb.append(row.get(j));
      }
      sb.append("]");
    }
    sb.append("]");
    System.out.println(sb.toString());
  }
  static void print2D(int[][] res) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < res.length; i++) {
      if (i > 0) sb.append(",");
      sb.append("[");
      for (int j = 0; j < res[i].length; j++) {
        if (j > 0) sb.append(",");
        sb.append(res[i][j]);
      }
      sb.append("]");
    }
    sb.append("]");
    System.out.println(sb.toString());
  }
`;

  if (pid === 2) {
    return `import java.util.*;
public class Main {
  public static void main(String[] args) {
${body}
    System.out.println(sb.toString());
  }
}`;
  }

  if (pid === 101 || pid === 103) {
    return `import java.util.*;
public class Main {
  public static void main(String[] args) {
${body}
  }
${helpers}
}`;
  }

  return `import java.util.*;
public class Main {
  public static void main(String[] args) {
${body}
  }
}`;
}

function buildCppPlain(_pid, _kind, _cmp, _userCode) {
  return null;
}

function buildCsharpPlain(_pid, _kind, _cmp, _userCode) {
  return null;
}

function buildKotlinPlain(_pid, _kind, _cmp, _userCode) {
  return null;
}

function buildCPlain(pid, _kind, _cmp, userCode) {
  if (pid !== 1) return null;
  return `#include <stdio.h>
#include <stdlib.h>

${userCode}

int main(void) {
  int n;
  if (scanf("%d", &n) != 1) return 1;
  int* nums = (int*)malloc(sizeof(int) * n);
  for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
  int t;
  scanf("%d", &t);
  int rs = 0;
  int* out = twoSum(nums, n, t, &rs);
  printf("[");
  for (int i = 0; i < rs; i++) {
    if (i) printf(",");
    printf("%d", out[i]);
  }
  printf("]\\n");
  free(nums);
  free(out);
  return 0;
}
`;
}
