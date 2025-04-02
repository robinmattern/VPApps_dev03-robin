// Main Web Search and AI Response Script
import ollama from "ollama";
import { createInterface } from 'readline';
import LIBs from '../../._2/FRT_Libs.mjs'

// Import modules using dynamic imports
var FRT = (await import(`${LIBs.AIC}/AIC90_FileFns_u1.03.mjs`)).default
var MWT = (await import(`${LIBs.MWT}/MWT01_MattFns_u1.03.mjs`)).default

// Setup environment variables and configuration
var { sayMsg, usrMsg, bDebug, bQuiet, bDoit } = FRT.setVars()
var aTS = FRT._TS

var __basedir = FRT.__basedir
var aAppPath = FRT.__dirname
var aAppDir = aAppPath.split(/[\\\/]/).splice(-1)
global.aAppDir = aAppDir
global.__basedir2 = FRT.path(aAppPath)
FRT.__basedir2 = FRT.path(aAppPath)

// Display configuration if verbose output is enabled
if (bQuiet == 2) {
  usrMsg(`\n -- C1201[  29]  bDebug: ${global.bDebug}, bQuiet: ${global.bQuiet}, bDoit: ${FRT.bDoit}, bForce: ${FRT.bForce}, bIsCalled: ${FRT.isCalled(import.meta.url)}`)
}

// Script configuration
var bDebug = 1        // Debug flag
var bPrtSources = 0   // Whether to print source content
var bIsInVSCode = FRT.isNotCalled(import.meta.url)

// Setup logfile
var aLogFile = `./${aAppDir}/t001.01.${aTS}_Response.txt`
FRT.setSay(3, aLogFile)

// Configure AI model
var aModel = 'qwen2:1.5b'  // Default model (.93 GB on rm228)
var nCTX_Size = 8000        // Default context size

// Process command line arguments
var mArgs = process.argv.slice(2)
aModel = mArgs[0] ? mArgs[0] : aModel
nCTX_Size = mArgs[1] ? mArgs[1] : nCTX_Size

// Configure prompt and Ollama parameters
var aPrompt = "Summarize the information and provide an answer. Use only the information in the following articles to answer the question:"
var ollamaUrl = 'http://localhost:11434/api/generate' // Adjust if Ollama runs elsewhere

var pParms = {
  model: aModel,
  prompt: `{Query}. ${aPrompt} {Text}`,
  stream: true,
  options: { num_ctx: nCTX_Size }
}

// Set up readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user asynchronously
const promptUser = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Main execution
(async () => {
  // Prompt user for search and AI queries
  let searchPrompt, aiPrompt;
  
  if (bDebug == true) {
    searchPrompt = "lexington,va";
    aiPrompt = ".";
  } else {
    searchPrompt = (await promptUser("Enter your search prompt (e.g., 'Lexington VA'): ")) || "Lexington VA Tourism";
    aiPrompt = (await promptUser("Enter your AI prompt (e.g., 'Tell me about tourism'): ")) || "Tell me about tourism";
  }
  
  usrMsg("")
  usrMsg(`  Search Prompt: "${searchPrompt}"`);
  usrMsg(`  AI Prompt:     "${aiPrompt}"`);

  const urls = await getNewsUrls(searchPrompt);
  const alltexts = await getCleanedText(urls);
  await answerQuery(aiPrompt, alltexts);

  rl.close(); // Close readline after execution
})();

/**
 * Fetches search result URLs from DuckDuckGo
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of URLs
 */
async function getNewsUrls(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
  usrMsg(`  Fetching from: ${url}`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const text = await response.text();
    if (!text) {
      usrMsg("\n Empty response from DuckDuckGo.");
      return ["https://www.lexingtonvirginia.com/"];
    }
    
    const searchResultsJson = JSON.parse(text);

    usrMsg("---------------------------------------------------------------------------------------------- ")
    usrMsg("Response from DuckDuckGo:")
    
    var pResults = {
      AbstractURL: searchResultsJson.AbstractURL,
      Results: MWT.fmtResults(searchResultsJson.Results),
      RelatedTopics: searchResultsJson.RelatedTopics
        ? MWT.fmtResults(searchResultsJson.RelatedTopics)
        : []
    }

    var aResults = JSON.stringify(pResults, null, 2).replace(/\\n     /g, "\n     ").replace(/\\n       /g, "\n       ")
    usrMsg(`\n  API Response:\n${aResults.replace(/{/, "").replace(/\n}/, "")}`)

    const results = [
      ...(searchResultsJson.Results || []),
      ...(searchResultsJson.RelatedTopics || []).flatMap(item =>
        "Topics" in item ? item.Topics : [item]
      ),
    ].filter(item => item.FirstURL && item.Text);

    if (searchResultsJson.AbstractURL) {
      results.unshift({ FirstURL: searchResultsJson.AbstractURL, Text: "Overview" });
    }

    const urls = results.map(result => result.FirstURL).slice(0, 5);
    if (urls.length === 0) {
      usrMsg("\n* No URLs found, returning fallback.");
      return ["https://www.lexingtonvirginia.com/"];
    }
    
    usrMsg(`\n  Found ${urls.length} URLs:`)
    return urls;

  } catch (error) {
    console.error("\n* Error in getNewsUrls:", error);
    return ["https://www.lexingtonvirginia.com/"];
  }
}

/**
 * Fetches and cleans text content from URLs
 * @param {Array} urls - Array of URLs to fetch
 * @returns {Promise<Array>} - Array of cleaned text blocks
 */
async function getCleanedText(urls) {
  const texts = [];
  for (const url of urls) {
    try {
      const response = await fetch(url);
      usrMsg(`    Fetching ${url}`);
      const html = await response.text();
      const text = await MWT.htmlToText(html);
      texts.push(`Source: ${url}\n${text}\n\n`);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }
  return texts;
}

/**
 * Processes query with Ollama model using provided text sources
 * @param {string} query - User query
 * @param {Array} texts - Array of text sources
 */
async function answerQuery(query, texts) {
  if (texts.length === 0) {
    usrMsg("\n* No text content available to summarize.");
    return;
  }

  usrMsg(`\nCompined Prompt for Model ${pParms.model}:`)
  usrMsg("---------------------------------------------------------------------------------------------- ")
  
  var aSources = texts.map((a, i) => `${i+1}.${MWT.fmtText(a)}`).join("\n")
  
  if (bPrtSources == 1) {
    usrMsg(`\n  Texts:  \n${aSources}`)
    usrMsg(`  Texts:  End of Sources`)
  } else {
    usrMsg(`  Texts:  ${texts.length} Sources, ${aSources.length} bytes`)
  }
  
  usrMsg(`  Query:  ${query}`)
  usrMsg(`  Prompt: ${pParms.prompt}`)

  pParms.prompt = pParms.prompt.replace(/{Query}/, query)
  pParms.prompt = pParms.prompt.replace(/{Text}/, texts.join("\n\n"))

  usrMsg(`\nOllama Model Response:`)
  usrMsg("---------------------------------------------------------------------------------------------- ")

  try {
    var stream = await ollama.generate(pParms);
    var [pStats, aResult] = await MWT.fmtStream(stream);

    if (global.nLog != 1) { 
      usrMsg(aResult) 
    }
    
    usrMsg("\n----------------------------------------------------------------------------------------------\n ")
    usrMsg(MWT.fmtStats(pStats, pParms).join("\n"))
    usrMsg("\n---------------------------------------------------------------------------------------------- ")

  } catch (error) {
    console.error("Error in answerQuery:", error);
  }
}