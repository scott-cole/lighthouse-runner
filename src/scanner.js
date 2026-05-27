import puppeteer from "puppeteer";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

export function getChromePath() {
  const path = puppeteer.executablePath();
  console.log("Chrome is at ", path);
  return path;
}

export async function runLighthouse(url) {
  const chromePath = puppeteer.executablePath();

  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ["--headless", "--no-sandbox"],
  });

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
    });

    const categories = result.lhr.categories;
    const audits = result.lhr.audits;

    const scores = {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      "best-practices": Math.round(categories["best-practices"].score * 100),
      seo: Math.round(categories.seo.score * 100),
    };

    const metrics = {
      lcp: Math.round(audits["largest-contentful-paint"].numericValue),
      tbt: Math.round(audits["total-blocking-time"].numericValue),
      cls: Math.round(audits["cumulative-layout-shift"].numericValue),
      fcp: Math.round(audits["first-contentful-paint"].numericValue),
      si: Math.round(audits["speed-index"].numericValue),
      tti: Math.round(audits["interactive"].numericValue),
    };

    return {
      url,
      scores,
      metrics,
    };
  } catch (err) {
    return { url, error: err.message };
  } finally {
    chrome.kill();
  }
}
