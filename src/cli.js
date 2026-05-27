function parseArgs(raw) {
  const args = raw.slice(2);
  console.log("Args", args);

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

console.log(parseArgs(process.argv));
