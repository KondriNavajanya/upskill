/**
 * Plain-text stdin encoding for compiled Judge0 harnesses (no JSON library needed).
 * Format is problem-specific; decoder lives in generated Java/C++/C# source.
 */

export function encodePlainStdin(problemId, args, executionKind) {
  if (executionKind === "mutate_first" && problemId === 2) {
    const chars = args[0];
    const joined = chars.join("");
    return `${joined.length}\n${joined}\n`;
  }

  switch (problemId) {
    case 1: {
      const [nums, t] = args;
      return `${nums.length}\n${nums.join(" ")}\n${t}\n`;
    }
    case 3: {
      const s = args[0];
      const b64 = Buffer.from(s, "utf8").toString("base64");
      return `${b64}\n`;
    }
    case 4:
    case 5:
    case 101: {
      const nums = args[0];
      return `${nums.length}\n${nums.join(" ")}\n`;
    }
    case 102:
    case 202: {
      const s = args[0];
      const b64 = Buffer.from(s, "utf8").toString("base64");
      return `${b64}\n`;
    }
    case 103: {
      const iv = args[0];
      const lines = [`${iv.length}`];
      for (const row of iv) {
        lines.push(`${row.length} ${row.join(" ")}`);
      }
      return `${lines.join("\n")}\n`;
    }
    case 201: {
      const [a, b] = args;
      return `${a.length}\n${a.join(" ")}\n${b.length}\n${b.join(" ")}\n`;
    }
    default:
      return null;
  }
}
