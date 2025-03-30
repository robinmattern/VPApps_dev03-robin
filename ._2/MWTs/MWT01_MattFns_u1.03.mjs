// MWT01_MattFns_u1.03.mjs - Matt's utility functions

   import   inquirer            from 'inquirer'
// import { Readability      }  from '@mozilla/readability';
// import { JSDOM            }  from 'jsdom';

async  function  ask4Text(aPrompt) {
  var  pResponse = await inquirer.prompt([
   {
       type:   'input',
       name:   'aResponse',
       message: aPrompt,
       theme: { prefix: '' } // Removes the '?' prefix
       }
  ]);
  var   aAnswer = pResponse.aResponse;
return  aAnswer;
       } // eof ask4Text
//   ---------------------  =  --------
/**
 * Converts HTML content to plain text using Mozilla's Readability
 * @param {string} html - HTML content to convert
 * @returns {string} - Extracted text content
 */
async  function htmlToText(html) {
  const { Readability } = await import('@mozilla/readability');
  const { JSDOM       } = await import('jsdom');
  
  const dom  = new JSDOM(html);
  const doc  = dom.window.document;
  const text = new Readability(doc).parse();
  return text.textContent;
}

/**
 * Formats text by cleaning up excessive whitespace and newlines
 * @param {string} text - Text to format
 * @returns {string} - Formatted text
 */
function fmtText(text) {
     let formattedText = text.replace(/[\n\r]\s*\n/g, "\n");
         formattedText = formattedText.replace(/    /g, " ");
  return formattedText;
}

/**
 * Formats search results for display
 * @param {Array} results - Array of result objects 
 * @returns {string} - Formatted results as string
 */
function fmtResults(results) {
  if (results.length === 0) { return ''; }
  const urls = results.map(result => `${result.FirstURL.trim()}\n       ${result.Text}`);
  return "\n     " + urls.join("\n     ");
}

/**
 * Formats Ollama model run statistics
 * @param {Object} stats - Statistics object from Ollama response
 * @param {Object} params - Parameters used for the model
 * @returns {Array} - Array of formatted statistics lines
 */
function fmtStats(stats, params) {
  const statsLines = [];
  statsLines.push(`Ollama Run Statistics:`);
  statsLines.push(`--------------------------------------------`);
  statsLines.push(`    Model Name:        ${params.model}`);
  statsLines.push(`    Context Window:    ${params.options.num_ctx} bytes`);
  statsLines.push(`    Total Duration:    ${(stats.total_duration / 1e9).toFixed(2)} seconds`);
  statsLines.push(`    Prompt Eval Count: ${stats.prompt_eval_count} tokens`);
  statsLines.push(`    Eval Count:        ${stats.eval_count} tokens`);
  statsLines.push(`    Eval Duration:     ${(stats.eval_duration / 1e9).toFixed(2)} seconds`);
  statsLines.push(`    Tokens per Second: ${(stats.eval_count / (stats.eval_duration / 1e9)).toFixed(2)}`);
  return statsLines;
}

/**
 * Shows hidden characters in a string (useful for debugging)
 * @param {string} str - String to analyze
 * @returns {string} - String with visible representations of hidden characters
 */
function showHiddenChars(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code === 10) result += "[\\n]";      // Newline
    else if (code === 13) result += "[\\r]"; // Carriage return
    else if (code === 9) result += "[\\t]";  // Tab
    else if (code === 32) result += "[ ]";   // Space
    else result += str[i];
  }
  return result;
}

/**
 * Formats the streaming response from Ollama
 * @param {Stream} stream - Ollama response stream
 * @returns {Promise<Array>} - Promise resolving to array containing [stats, result]
 */
async function fmtStream(stream) {
  let isNewLine = true;
  let result = "";
  let finalStats = null;

  for await (const chunk of stream) {
    if (isNewLine) {
      result += chunk.response;
      if (global.nLog == 1) {
        process.stdout.write(`    ${chunk.response}`);
      }
    } else {
      result += chunk.response;
      if (global.nLog == 1) {
        process.stdout.write(chunk.response);
      }
    }
    isNewLine = chunk.response.endsWith("\n");
    finalStats = chunk;
  }
  return [finalStats, result];
}

/**
 * Creates a readline interface for user input
 * @returns {Object} - Object with promptUser method
 */
function createUserInput() {
  const { createInterface } = require('readline');
  
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
  
  return {
    promptUser,
    close: () => rl.close()
  };
}

// Export as default object with named functions
export default {
  ask4Text, 
  fmtText,
  htmlToText,
  fmtResults,
  fmtStats,
  showHiddenChars,
  fmtStream,
  createUserInput
};