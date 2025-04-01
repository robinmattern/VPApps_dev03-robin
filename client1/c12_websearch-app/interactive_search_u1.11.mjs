/*\
##=========+====================+================================================+
##RD        interactive_search  | Main Web Search and AI Response Script
##RFILE    +====================+=======+===============+======+=================+
##FD interactive_search_u##.mjs |   ####|  4/01/25 HH:MM|   ###| p1.01`.501DD.HHMM
#
##DESC     .--------------------+-------+---------------+------+-----------------+
#            This script gets a "document" from an internet search.  It then
#            submits a prompt query against it using a selected AI model
#            It was originally written by Matt Williams on 10/01/25.
#
##LIC      .--------------------+----------------------------------------------+
#            Copyright (c) 2025 JScriptWare and 8020Date-FormR * Released under
#            MIT License: http://www.opensource.org/licenses/mit-license.php
##FNS      .--------------------+----------------------------------------------+
#                               |
# async ion  main( ) {     
# async ion  getNewsUrls( query ) {
# async ion  getCleanedText( urls ) {
# async ion  answerQuery( query, texts ) {
#                               |
##CHGS     .--------------------+----------------------------------------------+
#.(51001.01  10/01/25 MW   7:00a| Created by Matt Williama
#.(50329.01   3/29/25 RAM  8:30a| Cleaned up output 
#.(50330.01   3/30/25 CAI  2:30p| Wrwrittem by Claude AI
#.(50330.02   3/30/25 RAM  4:15p| Add Documentation 
#.(50330.03   3/30/25 RAM  7:00p| Replace createUserInput with ask4Text
#.(50330.06   3/30/25 XAI  8:15p| Write and use wrap 
#.(50331.01   3/31/25 XAI  7:55a| Add first URL as "document"  
#.(50330.06a  3/31/25 RAM  8:15a| Add indent to wrap
#.(50331.02   3/31/25 RAM 10:00a| Save logs to docs     
#.(50331.04   3/31/25 RAM  3:00p| Write and use getVars
#.(50331.04b  3/31/25 RAM  7:15p| Update StatsFile name   
#.(50330.04c  3/31/25 RAM  7:35p| Add web searchPrompt
#.(50331.05   3/31/25 RAM  9:00p| Add ReponseFile to Stats and CSV
#.(50331.07   3/31/25 RAM  9:30p| Don't prompt when inVSCode

##PRGM     +====================+===============================================+
##ID 69.600. Main0              |
##SRCE     +====================+===============================================+
\*/
//========================================================================================================= #  ===============================  #

   import   ollama              from "ollama";
// import { createInterface }   from 'readline';
// import * as readline         from 'readline'; 
// import { createInterface }   from 'node:readline/promises';
   import   LIBs                from '../../._2/FRT_Libs.mjs'
import { Stats } from "fs";

// Import modules using dynamic imports
// --  ---  --------  =  --  =  ------------------------------------------------------  #  

//     var  FRT              =( await import( `${LIBs.AIC}/AIC90_FileFns_u1.03.mjs`) ).default
       var  FRT              =( await import( `${LIBs.MWT}/AIC90_FileFns_u1.03.mjs`) ).default
       var  MWT              =( await import( `${LIBs.MWT}/MWT01_MattFns_u1.03.mjs`) ).default

// Setup environment variables and configuration
// --  ---  --------  =  --  =  ------------------------------------------------------  #  ---------------- #
      var { sayMsg, usrMsg, bDebug, bQuiet, bDoit } = FRT.setVars()
       var  aTS              =  FRT._TS

      var __basedir          =  FRT.__basedir
       var  aAppPath         =  FRT.__dirname
       var  aAppDir          =  aAppPath.split(/[\\\/]/).slice(-1)[0]   // Was splice 
     global.aAppDir          =  aAppDir
   global.__basedir2         =  FRT.path( aAppPath )
            FRT.__basedir2   =  FRT.path( aAppPath )
       var  bIsInVSCode      =  FRT.isNotCalled( import.meta.url )                      //.(50331.07.1)

// Display configuration if verbose output is enabled
// --  ---  --------  =  --  =  ------------------------------------------------------  #  
        if (bQuiet == 2) {
            usrMsg(`\n -- C1201[  29]  bDebug: ${global.bDebug}, bQuiet: ${global.bQuiet}, bDoit: ${FRT.bDoit}, bForce: ${FRT.bForce}, bIsCalled: ${FRT.isCalled(import.meta.url)}`)
            }

// Script configuration
// --  ---  --------  =  --  =  ------------------------------------------------------  #  

       var  bDebug           =  0                   // Debug flag

// Configure AI model
       var  aModel1          = 'llama'              // 4.7  GB on rm231 
       var  aModel1          = 'llama3.1'           // 4.7  GB on rm231 
       var  aModel1          = 'gemma2:2b'          // 1.6  GB on rm231 
       var  aModel1          = 'granite3-dense:2b'  // 1.6  GB on rm231 
       var  aModel1          = 'qwen2:0.5b'         //  .35 GB on rm231  //#.(50327.05.1 RAM Smallest. Runs if dbugging or no command args given )
       var  aModel1          = 'qwen2-robin:latest' //  .35 GB on rm231 

//     var  aModel1          = 'llama3.1:8b-instruct-q8_0' // 8.5  GB on rm228 
//     var  aModel1          = 'llama3.1:latest'           // 4.9  GB on rm228 
//     var  aModel1          = 'llama3.1:8b-instruct-q2_K' // 3.2  GB on rm228 // wierd results  
//     var  aModel1          = 'starcoder2:3b'             // 1.7  GB on rm228 // no results
//     var  aModel1          = 'qwen2:7b'                  // 4.4  GB on rm228 
//     var  aModel1          = 'qwen2:1.5b'                //  .93 GB on rm228 
     
       var  nCTX_Size1       =  8000
//     var  nCTX_Size1       =  16000

// Process command line arguments
       var  pVars            =  MWT.getVars( FRT.__dirname )                                                // .(50331.04.3 RAM Get .env vars Beg)
            aModel           =  pVars.MODEL       ||  aModel
            nCTX_Size        = (pVars.CTX_SIZE    ||  nCTX_Size) * 1
       var  nTemperature     = (pVars.TEMPERATURE || .07) * 1
       var  aSearch          =  pVars.SEARCH      || "Lexington Va"
       var  aAIPrompt        =  pVars.QUERY       || "What are the city's restaurants?"
       var  aSysPrompt       =  pVars.SYS_PROMPT                                                            // .(50331.09.1 

       var  mArgs            =  process.argv.slice(2)
       var  aModel           =  mArgs[0] ? mArgs[0] : aModel
       var  nCTX_Size        = (mArgs[1] ? mArgs[1] : nCTX_Size) * 1

        if (bDebug) {
            aModel           =  aModel1 
            nCTX_Size        =  nCTX_Size1   
            }                                                                                               // .(50331.04.3 End)

// Setup logfile
// --  ---  --------  =  --  =  ------------------------------------------------------  #  

       var  aServer          = (pVars.THE_SERVER   || '').slice( 0, 11 ), aSvr = aServer.slice(0,5)         // .(50331.04.x)
       var  bPrtSources      =  pVars.SHOW_SOURCES ||   0         // Whether to print source content
       var  nWdt             =  pVars.WRAP_WIDTH   || 145 
       var  nLog             =  pVars.TO_SCREEN_OR_FILE || 1                                                // .(50331.04.4)

       var  aRespId          = `${aAppDir.slice(0,3)}_${pVars.SESSION_ID}.${pVars.NEXT_POST}`               // .(50331.08.3 RAM Get RespId) 
       var  aNextPost        = `${ 1 + pVars.NEXT_POST * 1 }`.padStart( 2, "0" )                            // .(50331.08.4 RAM Set Next_Post) 
                                FRT.setEnv( "NEXT_POST", aNextPost, FRT.__dirname)                          // .(50331.08.5) 

//     var  aLogFile         =      `./${aAppDir}/${aAppDir.slice(0,3)}_t001.01.4.${aTS}_Response.txt`      //#.(50331.02.5)
       var  aLogFile         = `./docs/${aAppDir}/${aRespId}.4.${aTS}_Response.txt`                         // .(50331.08.6).(50331.02.5 RAM put it in /docs)
                                FRT.setSay( nLog, aLogFile )                                                // .(50331.04.5 RAM nLog was 3)
//     var  aStatsFile       =  FRT.join( __basedir, `./docs/${aAppDir}/${aAppDir.slice(0,3)}_Stats.csv` )   
       var  aStatsFile       = `${aAppDir.slice(0,3)}_Stats_u${aTS.slice(0,5)}-${aSvr}.csv`                 // .(50331.04b.1 RAM Update StatsFile name)
       var  aStatsFile       =  FRT.join( __basedir, `./docs/${aAppDir}/${aStatsFile}` )                    // .(50331.04b.2)

// Configure prompt and Ollama parameters
//     var  aSysPrompt       = "Summarize the information and provide an answer. Use only the information in the following articles to answer the question:"
       var  ollamaUrl        =  pVars.PLATFORM_URL // 'http://localhost:11434/api/generate'                 // .(50331.09.2 Adjust if Ollama runs elsewhere)

       var  pParms           = 
             {  model        :  aModel
             ,  prompt       : `{Query}.${aSysPrompt} {Text}`
             ,  stream       :  true
             ,  options      :{ num_ctx: nCTX_Size 
                              , temperature: nTemperature
                                }
                }
// --  ---  --------  =  --  =  ------------------------------------------------------  #  

                                await main( ) 

// Main execution
// --  ---  --------  =  --  =  ------------------------------------------------------  #  ---------------- #
  async  function  main( ) {     
       let  searchPrompt, aiPrompt; // Prompt user for search and AI queries
  
        if (bDebug == true || bIsInVSCode ) {                                           //.(50331.07.2)
            searchPrompt     =  aSearch       // "Lexington Va";                                                                             // .(50331.04.6)
            aiPrompt         =  aAIPrompt     // "The city's restaurants";                                                                   // .(50331.04.7)
        } else {
            usrMsg( "" )
//          searchPrompt     =( await MWT.ask4Text( "Enter your search prompt (e.g., '${aSearch)Lexington VA'): " ) ) || "Lexington Va";     //#.(50330.03.6).(50331.04.8)
            searchPrompt     =( await MWT.ask4Text( `Enter your search prompt (e.g., '${aSearch}'): `       ) ) ||  aSearch;                 // .(50331.04.8).(50330.03.6)
//          aiPrompt         =( await MWT.ask4Text( "Enter your AI prompt (e.g., 'Tell me about tourism'): ") ) || "Tell me about tourism";  //#.(50330.03.7).(50331.04.9)
            aiPrompt         =( await MWT.ask4Text( `Enter your AI prompt (e.g., '${aAIPrompt}'): `         ) ) ||  aAIPrompt;               // .(50331.04.9).(50330.03.7)
            }
            usrMsg("")
            usrMsg(`  Search Prompt: "${searchPrompt}"`);
            usrMsg(`  AI Prompt:     "${aiPrompt}"`);
// --  ---  --------  =  --  =  ------------------------------------------------------  #  

       var  urls             =  await getNewsUrls( searchPrompt );
       var  alltexts         =  await getCleanedText( urls );
                                await answerQuery( aiPrompt, alltexts, urls[0], searchPrompt )              // .(50330.04c.1 RAM Add searchPrompt).(50331.01.1 RAM Add first  URL)
            };
// --  ---  --------  =  --  =  ------------------------------------------------------  #  ---------------- #
/**
 * Fetches search result URLs from DuckDuckGo
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of URLs
 */
async function getNewsUrls( query ) {
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
    
       var  pResults = 
             {  AbstractURL:             searchResultsJson.AbstractURL
             ,  Results: MWT.fmtResults( searchResultsJson.Results )
             ,  RelatedTopics:           searchResultsJson.RelatedTopics
                       ? MWT.fmtResults( searchResultsJson.RelatedTopics )
                       : []
                }

       var  aResults =  JSON.stringify(pResults, null, 2).replace(/\\n     /g, "\n     ").replace(/\\n       /g, "\n       ")
            usrMsg(`\n  API Response:\n${ aResults.replace(/{/, "").replace(/\n}/, "") }`)

       var  results = 
             [ ...( searchResultsJson.Results || [] )
             , ...( searchResultsJson.RelatedTopics || []).flatMap( item =>
                  "Topics" in item ? item.Topics : [item]
                   ),
               ].filter( item => item.FirstURL && item.Text);

        if (searchResultsJson.AbstractURL) {
            results.unshift( { FirstURL: searchResultsJson.AbstractURL, Text: "Overview" } );
            }   

       var  urls = results.map(result => result.FirstURL).slice(0, 5);
        if (urls.length === 0) {
            usrMsg("\n* No URLs found, returning fallback.");
    return ["https://www.lexingtonvirginia.com/"];
            }
   
            usrMsg(`\n  Found ${urls.length} URLs:`)
    return  urls;

        } catch (error) {
            console.error("\n* Error in getNewsUrls:", error);
   return ["https://www.lexingtonvirginia.com/"];
            }
         };
// --  ---  --------  =  --  =  ------------------------------------------------------  #  
/**
 * Fetches and cleans text content from URLs
 * @param {Array} urls - Array of URLs to fetch
 * @returns {Promise<Array>} - Array of cleaned text blocks
 */
  async function getCleanedText(urls) {
       var  texts = [];
       for (var url of urls) {
       try {
       var  response = await fetch( url );
            usrMsg( `    Fetching ${url}`);
       var  html             =  await response.text();
       var  text             =  await MWT.htmlToText( html );
            texts.push(`Source:${url}\n${text}\n\n`);
        } catch (error) {
            console.error( `Error fetching ${url}:`, error );
            }
          }
    return  texts;
         };
// --  ---  --------  =  --  =  ------------------------------------------------------  #  
/**
 * Processes query with Ollama model using provided text sources
 * @param {string} query - User query
 * @param {Array} texts - Array of text sources
 */
async function answerQuery( query, texts, document, webSearch ) {                                           // .(50330.04c.2).(50331.01.2)
        if (texts.length === 0) {
            usrMsg( "\n* No text content available to summarize.");
    return;
            }
            usrMsg( `\nCompined Prompt for Model ${pParms.model}:`)
            usrMsg( "---------------------------------------------------------------------------------------------- ")
  
       var  aSources         =  texts.map((a, i) => `${i+1}.${MWT.fmtText(a)}`).join("\n")
  
        if (bPrtSources == 1) {
            usrMsg( `\n  Docs: \n${ MWT.wrap( aSources, nWdt , 2, 4 ) }`)               // .(50330.06a.6 RAM Add indent).(50331.01.3 RAM Was Texts).(50330.06.2 RAM Use Wrap)
            usrMsg(   `  Docs: End of Sources`)                                       // .(50331.01.4)
        } else {
            usrMsg(   `  Docs:   ${texts.length} Sources,${ `${aSources.length}`.padStart(6) } bytes from ${document}`)        // .(50331b.01.5).(50331.01.5 RAM Add documents)
            }
  
            usrMsg(   `  Query:     "${query}"` )
            usrMsg(   `  SysPrompt: "${ pParms.prompt.replace( /{Text}/, "" ).replace( /{Query}\./, "" ) }"` )
            usrMsg(   `  Prompt:    "{Query}. {SysPrompt}, {Docs}"` ) 

            pParms.prompt    =  pParms.prompt.replace( /{Query}/, query )
            pParms.prompt    =  pParms.prompt.replace( /{Text}/,  texts.join("\n\n" ))

            usrMsg( `\nOllama Model Response:`)
            usrMsg( "---------------------------------------------------------------------------------------------- ")
    try {
       var  stream           =  await ollama.generate( pParms );
       var[ pStats, aResult ]=  await MWT.fmtStream( stream );

        if (global.nLog != 1) { 
            aResult          =  MWT.wrap( aResult, nWdt, 4 )                            // .(50330.06a.7).(50330.06.3)
            usrMsg( aResult )                                                           // .(50330.06a.7).(50330.06.3)
            }
            pStats.query     =  query                                                   // .(50331.03.4 Beg)
            pStats.url       =  document
            pStats.websearch =  webSearch                                               // .(50330.04c.3 RAM Add)
            pStats.docs      = `${texts.length} Sources, ${aSources.length} bytes`
            pParms.logfile   = `${FRT.__baseDir}/${aLogFile}`                           // .(50331.05.6 RAM Add logfile) 
            pParms.temp      =  aTemperature                                            

            usrMsg( "\n----------------------------------------------------------------------------------------------\n ")
            usrMsg(             MWT.fmtStats(   pStats, pParms ).join("\n"))
            usrMsg( "\n---------------------------------------------------------------------------------------------- ")

   var [ pStats_JSON, mCSV ] =  MWT.savStats(   pStats, pParms )
       var  bNotExists       =  FRT.checkFileSync( aStatsFile ).exists == false                         
        if (bNotExists) {       FRT.writeFile(  aStatsFile, `${mCSV[0]}\n` ) }                  
                                FRT.appendFile( aStatsFile, `${mCSV[1]}\n` )            // .(50331.03.4 RAM Use it End)
        } catch (error) {
            console.error( "Error in answerQuery:", error);
            }
         };
// --  ---  --------  =  --  =  ------------------------------------------------------  #  ---------------- #
/*========================================================================================================= #  ===============================  *\
#>      C1201 END
\*===== =================================================================================================== */
/*\
##SRCE     +====================+===============================================+
##RFILE    +====================+=======+===================+======+=============+
\*/