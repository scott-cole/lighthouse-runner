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
  const table = new Table({
    head: ["URL", "Score", "Perf", "A11y", "BP", "SEO", "LCP", "TBT", "CLS"],
  });

  for (const r of results) {
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

  const totalPerf = results.reduce((sum, r) => sum + r.scores.performance, 0);
  const avgPerf = Math.round(totalPerf / results.length);
  const totalA11y = results.reduce((sum, r) => sum + r.scores.accessibility, 0);
  const avgA11y = Math.round(totalA11y / results.length);
  const totalBp = results.reduce(
    (sum, r) => sum + r.scores["best-practices"],
    0,
  );
  const avgBp = Math.round(totalBp / results.length);
  const totalSeo = results.reduce((sum, r) => sum + r.scores.seo, 0);
  const avgSeo = Math.round(totalSeo / results.length);

  console.log(table.toString());
  console.log("\n ── Averages ──");
  console.log(
    "  Performance: " +
      avgPerf +
      "  Accessibility: " +
      avgA11y +
      "  Best Practices: " +
      avgBp +
      "  SEO: " +
      avgSeo,
  );

  for (const r of results) {
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

    console.log("  " + color(bar) + " " + r.scores.performance + "% " + r.url);
  }
}
