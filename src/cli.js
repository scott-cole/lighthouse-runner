import pLimit from "p-limit";
import ora from "ora";
import chalk from "chalk";
import { crawl } from "./crawl.js";
import { runLighthouse } from "./scanner.js";
import { printResults } from "./display.js";

function parseArgs(raw) {
  const args = raw.slice(2);

  let url = null;
  let concurrency = 3;
  let showAll = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];

    if (a === "--all") {
      showAll = true;
    } else if (a === "-c" || a === "--concurrency") {
      concurrency = parseInt(args[i + 1], 10) || 3;
      i++; // skip the next arg since we consumed it
    } else if (a.startsWith("--concurrency=")) {
      concurrency = parseInt(a.split("=")[1], 10) || 3;
    } else if (url === null) {
      url = a;
    }
  }
  return { url, concurrency, showAll };
}

export async function main() {
  const flags = parseArgs(process.argv);
  let url = flags.url;

  if (!url || url === "-h" || url === "--help") {
    console.log(`
  ⚡ Lighthouse Site Scanner
  Usage: node index.js <url> [options]

  Options:
    -c, --concurrency=N   Number of concurrent Lighthouse runs (default: 3)
    -a, --all             Show all results (not just top 15)
    -h, --help            Show this help
`);
    return;
  }

  if (!url.startsWith("http")) url = "https://" + url;

  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  console.log(chalk.cyan("\n  ⚡ Lighthouse Site Scanner"));
  console.log(" " + date);
  console.log(" " + url + "\n");

  const spinner = ora({
    text: "Discovering pages...",
    spinner: "dots",
  }).start();

  const urls = await crawl(url);

  spinner.succeed("Discovered " + urls.length + " pages");

  if (urls.length === 0) {
    console.log("No pages found to scan");
    return;
  }

  const limit = pLimit(flags.concurrency);
  const tasks = urls.map((u) => limit(() => runLighthouse(u)));

  const scanSpinner = ora({
    text: "Scanning 0/" + urls.length,
    spinner: "dots",
  }).start();
  const results = [];

  for (const task of tasks) {
    const result = await task;
    results.push(result);
    scanSpinner.text = "Scanning " + results.length + "/" + urls.length;
  }

  scanSpinner.succeed(
    "Completed " + results.length + "/" + urls.length + " scans",
  );

  printResults(results);
}
