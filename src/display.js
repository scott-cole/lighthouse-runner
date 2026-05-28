import Table from "cli-table3";
import chalk from "chalk";

function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function printResults(results) {
  const success = results.filter((r) => r.scores);
  const failed = results.filter((r) => r.error);

  const table = new Table({
    head: ["URL", "Score", "Perf", "A11y", "BP", "SEO", "LCP", "TBT", "CLS"],
  });

  function fmt(v) {
    return v == null || isNaN(v) ? "-" : v;
  }

  for (const r of success) {
    table.push([
      r.url,
      letterGrade(r.scores.performance),
      r.scores.performance,
      r.scores.accessibility,
      r.scores["best-practices"],
      r.scores.seo,
      fmt(r.metrics.lcp),
      fmt(r.metrics.tbt),
      r.metrics.cls != null && !isNaN(r.metrics.cls) ? r.metrics.cls.toFixed(2) : "-",
    ]);
  }

  console.log(table.toString());

  if (success.length > 0) {
    console.log("");
    for (const r of success) {
      const score = r.scores.performance;
      const blocks = Math.round(score / 5);
      let color;
      if (score >= 90) color = chalk.green;
      else if (score >= 80) color = chalk.blue;
      else if (score >= 70) color = chalk.yellow;
      else color = chalk.red;
      console.log("  " + color("█".repeat(blocks)) + " " + score + "%  " + r.url);
    }
  }

  const total = (key) => success.reduce((s, r) => s + r.scores[key], 0);
  const avg = (key) => success.length ? Math.round(total(key) / success.length) : 0;
  const avgs = [
    ["Performance", avg("performance")],
    ["Accessibility", avg("accessibility")],
    ["Best Practices", avg("best-practices")],
    ["SEO", avg("seo")],
  ];

  console.log("");
  for (const [label, value] of avgs) {
    const filled = Math.round(value / 5);
    console.log("  " + "█".repeat(filled) + " " + value + "%  " + label);
  }

  if (failed.length > 0) {
    console.log(chalk.red("\n  ✗ " + failed.length + " failed") + " — " + failed.map((r) => r.url).join(", "));
  }
}
