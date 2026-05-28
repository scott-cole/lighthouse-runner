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

  for (const r of success) {
    table.push([
      r.url,
      letterGrade(r.scores.performance),
      r.scores.performance,
      r.scores.accessibility,
      r.scores["best-practices"],
      r.scores.seo,
      r.metrics.lcp,
      r.metrics.tbt,
      r.metrics.cls.toFixed(2),
    ]);
  }

  const totalPerf = success.reduce((sum, r) => sum + r.scores.performance, 0);
  const avgPerf = success.length ? Math.round(totalPerf / success.length) : 0;
  const totalA11y = success.reduce((sum, r) => sum + r.scores.accessibility, 0);
  const avgA11y = success.length ? Math.round(totalA11y / success.length) : 0;
  const totalBp = success.reduce(
    (sum, r) => sum + r.scores["best-practices"],
    0,
  );
  const avgBp = success.length ? Math.round(totalBp / success.length) : 0;
  const totalSeo = success.reduce((sum, r) => sum + r.scores.seo, 0);
  const avgSeo = success.length ? Math.round(totalSeo / success.length) : 0;

  console.log(table.toString());

  if (success.length > 0) {
    console.log("\n ── Performance Scores ──");
    for (const r of success) {
      const blocks = Math.round(r.scores.performance / 5);
      const emptyBlocks = 20 - blocks;
      const bar = "█".repeat(blocks) + "░".repeat(emptyBlocks);
      let color;

      if (r.scores.performance >= 90) {
        color = chalk.green;
      } else if (r.scores.performance >= 80) {
        color = chalk.blue;
      } else if (r.scores.performance >= 70) {
        color = chalk.yellow;
      } else color = chalk.red;

      console.log(
        "  " + color(bar) + " " + r.scores.performance + "%  " + r.url,
      );
    }
  }

  console.log("\n ── Averages ──");
  console.log(
    "  " +
      "█".repeat(Math.round(avgPerf / 5)) +
      "░".repeat(20 - Math.round(avgPerf / 5)) +
      " " +
      avgPerf +
      "%  Performance",
  );
  console.log("  " + avgA11y + "%  Accessibility");
  console.log("  " + avgBp + "%  Best Practices");
  console.log("  " + avgSeo + "%  SEO");

  if (failed.length > 0) {
    console.log("\n ── " + failed.length + " Failed ──");
    for (const r of failed) {
      console.log("  ✗ " + r.url);
    }
  }
}
