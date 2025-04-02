// main.mjs
import { MWT } from './MWT01_MattFns_u1.03.mjs';

const bDebug = true; // Set to false to enable user prompts
const aModel = 'llama3'; // Model for Ollama

// Main execution
(async () => {
  // Prompt user for search and AI queries
  const searchPrompt = bDebug
    ? "Lexington VA Tourism"
    : (await MWT.promptUser("Enter your search prompt (e.g., 'Lexington VA'): ")) || "Lexington VA Tourism";
  const aiPrompt = bDebug
    ? "Tell me about tourism"
    : (await MWT.promptUser("Enter your AI prompt (e.g., 'Tell me about tourism'): ")) || "Tell me about tourism";

  console.log(`Search Prompt: "${searchPrompt}"`);
  console.log(`AI Prompt: "${aiPrompt}"`);

  const urls = await getNewsUrls(searchPrompt);
  const allTexts = await getCleanedText(urls);
  await answerQuery(aiPrompt, allTexts);
})();

async function getNewsUrls(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
  console.log(`Fetching from: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const text = await response.text();
    if (!text) {
      console.log("Empty response from DuckDuckGo.");
      return ["https://www.lexingtonvirginia.com/"];
    }
    const searchResultsJson = JSON.parse(text);

    console.log("API Response:", JSON.stringify({
      AbstractURL: searchResultsJson.AbstractURL,
      Results: MWT.fmtResults(searchResultsJson.Results || []),
      RelatedTopics: searchResultsJson.RelatedTopics
        ? MWT.fmtResults(searchResultsJson.RelatedTopics.slice(0, 3))
        : []
    }, null, 2));

    const results = [
      ...(searchResultsJson.Results || []),
      ...(searchResultsJson.RelatedTopics || []).flatMap(item => "Topics" in item ? item.Topics : [item])
    ].filter(item => item.FirstURL && item.Text);

    if (searchResultsJson.AbstractURL) {
      results.unshift({ FirstURL: searchResultsJson.AbstractURL, Text: "Overview" });
    }

    const urls = results.map(result => result.FirstURL).slice(0, 5);
    if (urls.length === 0) {
      console.log("No URLs found, returning fallback.");
      return ["https://www.lexingtonvirginia.com/"];
    }
    console.log(`Found ${urls.length} URLs:`, urls);
    return urls;
  } catch (error) {
    console.error("Error in getNewsUrls:", error);
    return ["https://www.lexingtonvirginia.com/"];
  }
}

async function getCleanedText(urls) {
  const texts = [];
  for (const url of urls) {
    try {
      const response = await fetch(url);
      console.log(`Fetching ${url}`);
      const html = await response.text();
      const text = MWT.htmlToText(html);
      texts.push(`Source: ${url}\n${text}\n\n`);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }
  return texts;
}

async function answerQuery(query, texts) {
  if (texts.length === 0) {
    console.log("No text content available to summarize.");
    return;
  }
  try {
    const ollamaUrl = 'http://localhost:11434/api/generate';
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: aModel,
        prompt: `${query}. Summarize the information and provide an answer. Use only the information in the following articles: ${texts.join("\n\n")}`,
        stream: true,
        options: { num_ctx: 16000 }
      })
    });

    if (!response.ok) throw new Error(`Ollama HTTP error! Status: ${response.status}`);

    let finalStats = {};
    await new Promise((resolve, reject) => {
      let buffer = '';
      response.body.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim()) {
            const chunk = JSON.parse(line);
            if (chunk.response) {
              process.stdout.write(chunk.response);
              finalStats = chunk;
            }
          }
        }
      });

      response.body.on('end', () => {
        if (buffer.trim()) {
          const chunk = JSON.parse(buffer);
          if (chunk.response) {
            process.stdout.write(chunk.response);
            finalStats = chunk;
          }
        }
        console.log("\n", MWT.fmtFinalStats(finalStats).join("\n"), "\n");
        resolve();
      });

      response.body.on('error', reject);
    });
  } catch (error) {
    console.error("Error in answerQuery:", error);
  }
}