import   ollama         from "ollama";
import { ChromaClient } from "chromadb";
import { getConfig }    from "./utilities.js";

const { embedmodel, mainmodel } = getConfig();

const chroma = new ChromaClient( { path: "http://localhost:8000" } ); // Explicit http://

// ---------------------------------------------------------------------------------------------------------

let collection;
try {
    collection = await chroma.getOrCreateCollection({ 
        name: "buildragwithtypescript", 
        metadata: { "hnsw:space": "cosine" } 
    });
    console.log( "\n  Collection ready.");                                              // .(50325.02.2 RAM Add 2 leading spaces)
} catch (error) {
    console.error( "* Error creating/getting collection:", error.message, "\n");        // .(50325.02.3 RAM Add \n and *)
    process.exit(1); // Exit if collection fails
    }
// ---------------------------------------------------------------------------------------------------------

var query = process.argv.slice(2).join(" ");

let queryembed;
try {
    queryembed = (await ollama.embeddings({ model: embedmodel, prompt: query })).embedding;
    if (!queryembed) throw new Error("\n* No embedding returned from ollama\n");        // .(50325.02.4 RAM Add "\n"s)
} catch (error) {
    console.error("\n* Error generating query embedding:", error.message, "\n");        // .(50325.02.5)
    process.exit(1);
    }
// ---------------------------------------------------------------------------------------------------------


if (query == "") { console.log( "\n* Please enter a question on the command line.\n"); process.exit()  }    // .(50325.02.6)

// ---------------------------------------------------------------------------------------------------------

    console.log( `\n  Asking Ollama model, ${mainmodel}: '${query}'\n` );                                   // .(50325.02.2 RAM Add Msg)

let relevantDocs;
try {
    relevantDocs = (await collection.query({ queryEmbeddings: [queryembed], nResults: 5 })).documents[0].join("\n\n");
} catch (error) {
    console.error("\n* Error querying collection:", error.message, "\n");               // .(50325.02.6)
    process.exit(1);
    }
// ---------------------------------------------------------------------------------------------------------

const modelQuery = `${query} - Answer that question using the following text as a resource: ${relevantDocs}`;

let finalStats = null;                                             // .(50325.04.1 RAM Add FinalStats)
let isNewLine = true; // Track if we're at the start of a line     // .(50325.03.1)
let aResult=""                                                     // .(50325.05.1)

// ---------------------------------------------------------------------------------------------------------
try {

    var pParms = { model:  mainmodel
                 , prompt: modelQuery
                 , stream: true 
                   }
    
    var stream = await ollama.generate( pParms );
    
    for await (const chunk of stream) {
      if (isNewLine) {                                              // .(50325.03.2 RAM Use isNewLine)
          aResult = `${aResult}${chunk.response}`                   // .(50325.05.2 RAM Capture result)
          process.stdout.write( `    ${chunk.response}` );          //  Indent only at line start
      } else {                                                      // .(50325.03.3)        
          aResult = `${aResult}${chunk.response}`                   // .(50325.05.3)
          process.stdout.write(chunk.response);                     //  No extra indent mid-line
          }                                                         // .(50325.03.4)
                                                                    //  Update new line status: true if chunk ends with \n 
          isNewLine  = chunk.response.endsWith("\n");               // .(50325.03.5)
          finalStats = chunk;                                       // .(50325.04.2)
        }
  } catch (error) {
      console.error( "\n* Error generating response from ollama:", error.message, "\n" );  // .(50325.02.7)
      }
// ---------------------------------------------------------------------------------------------------------

  console.log("\n\n  Ollama Run Statistics:"); // .(50325.04.3 Beg)
  console.log(`    Total Duration: ${(finalStats.total_duration / 1e9).toFixed(2)} seconds`);
  console.log(`    Prompt Eval Count: ${finalStats.prompt_eval_count} tokens`);
  console.log(`    Eval Count: ${finalStats.eval_count} tokens`);
  console.log(`    Eval Duration: ${(finalStats.eval_duration / 1e9).toFixed(2)} seconds`);
  console.log(`    Tokens per Second: ${(finalStats.eval_count / (finalStats.eval_duration / 1e9)).toFixed(2)}`);
  console.log( "" )                       // .(50325.04.3 End)

  console.log( "  The answer is:\n    ", aResult.replace( /\n/, ) )  // .(50325.05.4)  
  console.log( "" )       // .(50325.05.5)                                         



try {

    var pParms = { model:  mainmodel
                 , prompt: modelQuery
                 , stream: true 
                   }
    
    var stream =  await ollama.generate( pParms );
    
    for await (const chunk of stream) {
          process.stdout.write( chunk.response );                     //  No extra indent mid-line
        }
  } catch (error) {
      console.error( "\n* Error generating response from ollama:", error.message, "\n" );  // .(50325.02.7)
      }

