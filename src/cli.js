import pLimit from "p-limit";
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
  if (!url) {
    console.log("no url entered");
    return;
  }

  if (!url.startsWith("http")) url = "https://" + url;

  const urls = await crawl(url);
  if (urls.length === 0) {
    console.log("No pages found to scan");
    return;
  }

  const limit = pLimit(flags.concurrency);
  const tasks = urls.map((u) => limit(() => runLighthouse(u)));
  const results = await Promise.all(tasks);

  printResults(results);
}

main();
