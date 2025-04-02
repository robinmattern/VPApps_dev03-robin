// MWT01_MattFns_u1.03.mjs - Matt's utility functions

import { createInterface } from 'readline';

// Function to prompt user asynchronously
export function promptUser(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Format search results for logging
export function fmtResults(mResults) {
  const mURLs = mResults.map(pResult => `${pResult.padEnd(50)} -- ${pResult.FirstURL}`);
  return mURLs.join("\n   ");
}

// Convert HTML to plain text using Readability
export function htmlToText(html) {
  const { JSDOM } = await import('jsdom');
  const { Readability } = await import('@mozilla/readability');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const text = new Readability(doc).parse();
  return text.textContent;
}

// Format final Ollama run statistics
export function fmtFinalStats(pStats) {
  const mStats = [
    `  Ollama Run Statistics:`,
    `    Total Duration:    ${(pStats.total_duration / 1e9).toFixed(2)} seconds`,
    `    Prompt Eval Count: ${pStats.prompt_eval_count} tokens`,
    `    Eval Count:        ${pStats.eval_count} tokens`,
    `    Eval Duration:     ${(pStats.eval_duration / 1e9).toFixed(2)} seconds`,
    `    Tokens per Second: ${(pStats.eval_count / (pStats.eval_duration / 1e9)).toFixed(2)}`
  ];
  return mStats;
}

export default { promptUser, fmtResults, htmlToText, fmtFinalStats };