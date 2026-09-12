export type DiffKind = "same" | "add" | "del";

export type DiffLine = {
  kind: DiffKind;
  text: string;
};

const LINE_CAP = 4000;

export function diffLines(left: string, right: string): DiffLine[] {
  const a = left.split("\n").slice(0, LINE_CAP);
  const b = right.split("\n").slice(0, LINE_CAP);
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      lines.push({ kind: "same", text: a[i] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      lines.push({ kind: "del", text: a[i] });
      i += 1;
    } else {
      lines.push({ kind: "add", text: b[j] });
      j += 1;
    }
  }
  while (i < n) {
    lines.push({ kind: "del", text: a[i] });
    i += 1;
  }
  while (j < m) {
    lines.push({ kind: "add", text: b[j] });
    j += 1;
  }
  return lines;
}
