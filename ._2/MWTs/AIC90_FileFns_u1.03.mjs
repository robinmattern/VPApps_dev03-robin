/*\
##=========+====================+================================================+
##RD        AIC90_FileFns       | AICodeR Functions
##RFILE    +====================+=======+===============+======+=================+
##FD  AIC90_FileFns_u##.mjs     |   ####|  1/19/25 HH:MM|   ###| p1.01`.501DD.HHMM
#
##DESC     .--------------------+-------+---------------+------+-----------------+
#            This script implements the App Folders Script for AICodeR# Apps.
#
##LIC      .--------------------+----------------------------------------------+
#            Copyright (c) 2025 JScriptWare and 8020Date-FormR * Released under
#            MIT License: http://www.opensource.org/licenses/mit-license.php
##FNS      .--------------------+----------------------------------------------+
#                               |
#       ion  sayMsg( aMsg, nSay, bCR ) {
#       ion  exit_wCR( nErr ) {
#       ion  usrMsg( aMsg, nOpt, bCR) {
#       ion  setPaths( aAppName ) {
#       ion  setVars( bDebug_, bQuiet_, bDoit_ ) {
#       ion  QT( b,c,d ) {
#       ion  isCalled(    aImportMetaURL, aProcessArgv1 ) {
#       ion  isNotCalled( aImportMetaURL, aProcessArgv1 ) {
#       ion  getAppName( __dirname, aName ) {
#       ion  getFileDate( aFilePath, nFmt, nLen  ) {
#       ion  getDate( nDate, nDateStart, nMinLength, nHrs ) {
# async ion  checkFileASync( aFilePath  ) {
#       ion  checkFileSync( aFilePath  ) {
# async ion  makDirASync(   aDirName  ) {
#       ion  makDirSync(    aDirName  ) {
# async ion  function createDirectoryIfNotExists( dirPath ) {
#       ion  lastFile( aPath, reFind ) {
#       ion  setEnv( aVar, aVar, aDir ) {
#       ion  getDir(  pattern, aDir ) {
#       ion  getFile( pattern ) {
#       ion  firstFile( aPath, reFind ) {
#       ion  listFiles( aPath ) {
#       ion  FRT_path( ...args ) {
#       ion  cleanPath( aPath ) {
# async ion  writeFileASync(  aFilePath, aData, pOptions ) {
# async ion  writeFileSync(   aFilePath, aData, pOptions ) {
# async ion  readFileASync(   aFilePath, pOptions ) {
#       ion  readFileSync(    aFilePath, pOptions ) {
# async ion  deleteFileASync( aFilePath ) {
#       ion  deleteFileSync(  aFilePath ) {
# async ion  copyFileASync(   aFilePath ) {
#       ion  copyFileSync(    aFilePath ) {
# async ion  fetchFromOpenAI( aAPI_URL, pMessageObject, aAPI_KEY ) {
#
##CHGS     .--------------------+----------------------------------------------+
#.(50101.06   1/01/25 RAM  7:00a| Created ...
#.(50122.06   1/22/25 RAM 10:23a| Write getFileDate
#.(50210.02   2/10/25 RAM 10:23a| Write copyFile functions
#.(50210.02b  3/02/25 RAM 11:45a| Write appendFile functions
#.(50209.01c  3/17/25 RAM  6:36p| Format code 
#.(50331.02   3/31/25 RAM 10:00a| Save log to docs  
#.(50331.08   3/31/25 RAM  8:00p| Write and use setEnv

##PRGM     +====================+===============================================+
##ID 69.600. Main0              |
##SRCE     +====================+===============================================+
\*/
//========================================================================================================= #  ===============================  #

// import   vscode           from 'vscode'                                              // .(40819.10.4 RAM Yuk!}
   import   fs               from 'fs/promises'                                         // .(40827.01.1 RAM Needed for ASync fns)
   import   fsync            from 'fs'
   import   path             from 'path'
   import   dotenv           from 'dotenv';
   import   os               from 'os'                                                  // .(40910.03.1)

//   -- --- ---------------  =  ------------------------------------------------------  #  ---------------- #

       var  __basedir                                                                   // .(40828.02.1)
       var  __dirname                                                                   //#.(40828.02.2 RAM Assigned in CommonJS)
       var  _ENV_Debug       =  false                                                   // .(40829.01.3 RAM Debug dotenv)
       var  _TS                                                                         // .(40908.02.x RAM Need this too)
       var  _OS              =  os.platform                                             // .(40910.03.2)

//   ---------------------  = --------------------------------------------------------- // -------- // ---- //
        //  debugger

 //      var m = getDir( '', 'docs/a51_claude-app' ); console.log( m ); process.exit()

       var  bDebug          =  0                                                        // .(50125.01.3 RAM Add bDebug)
       var  bQuiet          =  0                                                        // .(50125.01.4 RAM Add bQuiet)
       var  bDoit           =  0                                                        // .(50125.01.5 RAM Add bDoit)
       var  bForce          =  0                                                        // .(50215.01.6 RAM Add bForce)
       var  nLog            =  1                                                        // .(50218.01.4)

//     var  bDebug          =  process.env['Debug'] ? process.env['Debug'] : bDebug     //#.(50125.01.6).(50107.02b.3 RAM Use global).(50107.02.1 RAM Add sayMsg Beg)
//          console.log(  `  - AIC90[ 22]  bDebug: ${bDebug}`); // process.exit()
      try { bDebug          =  fsync.readFileSync('.env','ASCII').match(/FRT_bDEBUG *= *"*1/) != null } catch(e) { }  // .(50206.01.1 RAM Another way to set bDebug)
        if (bDebug) { debugger }                                                                            // .(50206.01.2)
            setVars( bDebug )                                                                               // .(50206.01.3).(50125.01.16 RAM Run here too)
        if (bQuiet == 0) {                                                                                  // .(50301.01.2)
            console.log( `\n -- AIC90[  92]  bDebug: ${global.bDebug}, bQuiet: ${global.bQuiet}, bDoit: N/A, bIsCalled: N/A` )                                          // .(50202.03.12)
            }
//          console.log(   `  - AI202[  88]  process.argv[ '${ process.argv.slice(2).join("', '") }' ]` ); 
/* 
            global.bDebug = 1
            sayMsg( "-------", -1    )
            sayMsg( ""               )  // nada
            sayMsg( "Hello",    0    )  // nada
            sayMsg( "-------",  1, 1 )
            sayMsg( "",        -1, 1 )  // two lines 
            sayMsg( "",        -4    )  // nada 
            sayMsg( "-------",  1    )            // 1  2  3  4
            sayMsg( "AI202[ 103]  Err", -3    )   // x  x  x  x
            sayMsg( "AI202[ 102]  Cmt", -2    )   // x  x     x     
            sayMsg( "AI202[ 101]  Deb", -1    )   // x        x
            sayMsg( "AI202[ 104]  Bug", -4    )   //          x 
            sayMsg( "AI202[ 105]  deb",  1, 1 )   // x  x  x  x 
            sayMsg( " ",                -3, 0 )   // x  x  x  x 
            process.exit() 
*/ 
  function  sayMsg( aMsg, nSay, bCR ) {                                                 // .(50107.02.3 RAM Add sayMsg Beg)
//      if (bCR) { console.log("") }                                                                        //#.(50121.03.5).(50121.03b.5)
        if (aMsg == "" || aMsg.slice(0,1) == "\n" ){ say( aMsg ); return }              // .(50218.02.5 RAM Just say it) 
            nSay    =  nSay > 0 ? nSay : -[0,3,2,1,4][-nSay]                                                // .(50209.01c.1 RAM -e,-c,-b,-g) 
       var  nDebug_ = ((typeof(global.bDebug) != 'undefined') ? global.bDebug : bDebug ) * 1                // .(50209.01.6 RAM Add * 1 here).(50125.01.7 RAM bDebug is local to this script) 
            nDebug_ =  [ 0, 3, 2, 1, 4 ][ nDebug_ ]                                                         // .(50209.01c.2) 
       //      if (nSay   == "-1" && bDebug == "1") { if (bCR) { console.log("") }; console.log( `  - ${aMsg}` ) }                    //#.(50125.01.8).(50121.03b.5))
//      if (nSay   == "-1" && (nDebug_ == 1     || nDebug_ == 5)) { if (bCR) { console.log("") }; console.log( `  - ${aMsg}` )}       // .(50209.01.7 RAM Was: * 1).(50125.01.8).(50121.03b.5)) 
//      if (nSay   == "-2" && (nDebug_ == 2     || nDebug_ == 5)) { if (bCR) { console.log("") }; console.log( `  ' ${aMsg}` )}       // .(50209.01.8 RAM Add Comment) 
//      if (nSay   == "-3" && (nDebug_ == 3     || nDebug_ == 5)) { if (bCR) { console.log("") }; console.log( `  * ${aMsg}` )}       // .(50209.01.9 RAM Add Error Msg) 
//      if (nSay   == "-4" && (nDebug_ == 4     || nDebug_ == 5)) { if (bCR) { console.log("") }; console.log( `  + ${aMsg}` )}       // .(50209.01.10 RAM Add Debugger Msg) 
        if (nSay   == "-1" && (nSay >= -nDebug_ || nDebug_ == 5)) { if (bCR) { say("") }; say( "*", aMsg )} // .(50209.01c.3 RAM Was '-').(50209.01b.1).(50209.01.7 RAM Was: * 1).(50125.01.8).(50121.03b.5)) 
        if (nSay   == "-2" && (nSay >= -nDebug_ || nDebug_ == 5)) { if (bCR) { say("") }; say( "'", aMsg )} //                           .(50209.01b.2).(50209.01.8 RAM Add Comment) 
        if (nSay   == "-3" && (nSay >= -nDebug_ || nDebug_ == 5)) { if (bCR) { say("") }; say( "-", aMsg )} // .(50209.01c.4 RAM Was '-').(50209.01b.3).(50209.01.9 RAM Add Error Msg) 
        if (nSay   == "-4" && (nSay >= -nDebug_ || nDebug_ == 5)) { if (bCR) { say("") }; say( "+", aMsg )} //                           .(50209.01b.4).(50209.01.10 RAM Add Debugger Msg) 
        if (nSay   ==  "1" ) {                                      if (bCR) { say("") }; say( "-", aMsg )} //                           .(50209.01b.5) 
        if (nSay   ==  "2" ) {                                      if (bCR) { say("") }; say( "-", aMsg ); exit_wCR()} // p.exit() } // .(50209.01b.6).(50201.09.11 RAM Use exit_wCR) 
        if (nSay   ==  "3" ) {                                      if (bCR) { say("") }; say( "-", aMsg ); }                         // .(50313.03.x Same as 1 for return vs exit)
    }; // eof sayMsg                                                            // .(50107.02.3 End)
//     ---  --------  =  --  =  ------------------------------------------------------  #  

  function  say( aChr, aMsg, nLog2 ) {                                                  // .(50209.01b.7) 
            aMsg  =  aMsg ? `  ${aChr} ${aMsg}` : aChr; 
       var  nLog_ = ((typeof(global.nLog) != 'undefined') ? global.nLog : nLog ) * 1    // .(50218.01.6 RAM Add File logging Beg)
            nLog_ =  nLog2 ? nLog2 : nLog_
        if (nLog_ == 1 || nLog_ == 3) { console.log( aMsg ) }                                                            
        if (nLog_ == 2 || nLog_ == 3) { sayFile_log( aMsg ) }                                                            
            } // eof say  
//     ---  --------  =  --  =  ------------------------------------------------------  #  

  function  sayFile_log( aMsg ) { 
            fsync.appendFileSync( global.aLogFile, aMsg + '\n'); 
//          console.log( '  - AIC90[ 138]  Writing to log:', aMsg )
            } // eof sayFile_log                                                        // .(50218.01.6 End)
//     ---  --------  =  --  =  ------------------------------------------------------  #  
// --  ---  --------  =  --  =  ------------------------------------------------------  #  ---------------- #

  function  setSay( nLog_, aFile ) {                                                    // .(50218.01.7 RAM Write saySet Beg)
            global.nLog  = nLog_ ? nLog_ : 1 
        if (nLog_ == 2 || nLog_ == 3) { 
//          global.aLogFile = path.join( __basedir2, `../._/LOGs/_v${_TS.slice(0,5)}/${aFile}_v${_TS}.log` ) 
       var  aLogFile        =  aFile.replace( /{aTD}/, _TS.slice(0,5) ).replace( /{aTS}/, _TS )
//     var  aDir            = `._/LOGs/_v${_TS.slice(0,5)}/${ aFile.split( /[\\\/]/ ).slice(0,-1).join( "/") }` 
        if (aFile.match( /docs\// )) {                                                  // .(50331.02.1 RAM Put log into /docs Beg)
       var  aDir            = `${ aLogFile.split( /[\\\/]/ ).slice(0,-1).join( "/") }`
       var  aLogDir         =  path.join( `${__basedir}`, aDir )          
        } else {                                                                        // .(50331.02.1 Beg)
       var  aDir            = `._/LOGs/${ aLogFile.split( /[\\\/]/ ).slice(0,-1).join( "/") }`
       var  aLogDir         =  path.join( `${__basedir2}/..`, aDir )          
//          global.aLogFile = path.join( `${__basedir2}/..`, aDir, aLogFile.split( /[\\\/]/ ).slice(-1)[0]) //#.(50329.04.1 RAM path.join behaves differently in VSCode, that Node)
//          global.aLogFile = FRT_path(  `${__basedir2}/..`, aDir, aLogFile.split( /[\\\/]/ ).slice(-1)[0]) //#.(50329.04.1 RAM Use FRT_path).(50331.02.2) 
//          fsync.mkdirSync(  path.join( `${__basedir2}/..`, aDir ), { recursive: true } )                  //#.(50329.04.2).(50331.02.2) 
            }
//          global.aLogDir  = aLogDir                                                   //#.(50331.02.4 RAM Save aLogDir) 
            global.aLogFile = FRT_path( aLogDir, aLogFile.split(/[\\\/]/).slice(-1)[0]) // .(50331.02.2).(50329.04.1 RAM Use FRT_path) 
            fsync.mkdirSync(  aLogDir, { recursive: true } )                            // .(50331.02.3).(50329.04b.2) 
            fsync.writeFileSync( global.aLogFile, '' ); 

        if (global.aLogFile.match(/bash|user/) == null) {                               // .(50301.02.1)
            console.log( `  - AIC90[ 171]  Setting logfile to: '${global.aLogFile}` )
            }  }                                                                        // .(50301.02.2)
         }; // eof saySet                                                               // .(50218.01.7 End)
// --  ---  --------  =  --  =  ------------------------------------------------------  #  ---------------- #

  function  exit_wCR( nErr ) {                                                          // .(50129.02.1 RAM Add exit_wCR Beg)
        if (os.platform().slice(0,3) != 'win') { console.log( "" ) }                    // .(50201.09.1 RAM Don't use usrMsg.  Log separately)
        if (global.bInVSCode == 1) { console.log( "") }                                 // .(50208.08.3)
//      if (bDebug) { console.log("") }                                                 // .(50201.09.2 RAM Maybe in debugger.  )
        if (global.bTest == 1) { return nErr } else { process.exit( nErr ) }            // .(50208.03.6 RAM does global.bTest exist)
            }                                                                           // .(50129.02.1 End)
// --  ---  --------  =  --  =  ------------------------------------------------------  #  ---------------- #

  function  usrMsg( aMsg, nOpt, bCR ) {                                                 // .(50125.01.1 RAM Write usrMsg)
       var  bQuiet_   =  global.bQuiet == 1; if (typeof( bQuiet_ ) == 'undefined') { bQuiet_ = bQuiet }
        if (bQuiet_ ) {  return }
        if (bCR)      {  say( "" ) }                                                    // .(50218.01.8 RAM Was: console.log) 
                         say( aMsg );                                                   // .(50218.01.9) 
        if (nOpt == 2) { exit_wCR( ) }                                                  // .(50129.02.2 RAM Was process.exit())
            } // eof usrMsg                                                             // .(50125.01.1 End)
  //   ---------------------  =  --------------------------------------------------------

    if (typeof(vscode) == 'object')  {                                                  // .(40819.10.5 RAM Need to reassign __basedir Beg)
        var  workspaceFolders = vscode.workspace.workspaceFolders;
         if (workspaceFolders && workspaceFolders.length > 0) {
        var   aAppName  =   'AICodeR_VSCodeExt'                                         // .(40828.02.3)
        var __dirname   =   workspaceFolders[0].uri.fsPath;
        var __basedir   = __dirname.replace( /[\\\/]\._2.+/, '' ).replace( /^\/([A-Z]):/, '$1:' )
        var  _TS        =   getDate()
            console.log( `  FRT[1]: __basedir: '${__basedir}'`)
            }
          } else {  // eif typeof(vscode) == 'object'                                   // .(40828.02.4)
       var  aAppName    =   setPaths( )                                                 // .(40828.02.5 RAM Will it set the global vars? No)
            }       // eif typeof(vscode) != 'object'                                   // .(40819.10.5 End)
//  --------------------------------------------------------------

  function  setPaths( aAppName ) {
        var   aLibFile  =  new URL( import.meta.url ).pathname                          // .(40819.03.1 RAM ES6 Module, this script's file name)
//      var   aLibFile  =  __filename                                                   // .(40819.03.1 RAM CommonJS Module)
   if (typeof(vscode) != 'object')  {                                                   // .(40819.10.6 RAM Don't assign __basedir if in extensionBeg)

     global.__libpath   =  path.dirname( aLibFile )                                     // this script's folder name
     global.__dirname   =  path.dirname( process.argv[1] )                              // calling folder name
            __dirname   =  global.__dirname                                             // .(40828.02.6 RAM It's not defined in "this" closure???)
     global.__basedir   =  aLibFile.replace( /[\\\/]\._2.+/, '' ).replace( /^\/([A-Z]):/, '$1:' )           // .40815.02.1 RAM Remove leading '/C:/)
            __basedir   =  global.__basedir                                             // .(40828.02.6 RAM It's not defined in "this" closure???)
     global._TS         =  getDate( )
            _TS         =  global._TS                                                   // .(40828.02.6)
     global.__appname   =  getAppName( __dirname, aAppName  )
        var   aCS       = (__appname.match( /^c/ ) ?  'client' : 'server') + __appname.substring( 1, 2 )
//            aCS       =  aCS.match( /[0-9]$/ ) ? aCS : '._2/FRTs/AICodeR'             //#.(40819.03.x RAM ?? )
              aCS       =  aCS.match( /[0-9]$/ ) ? aCS : '._2/FRTs'                     // .(40819.03.x RAM ?? )
     global.__apppath   =  path.join(  __basedir, `${aCS}/${ __appname }` )
//            console.log(`  FRT[2]: __basedir:  '${ __basedir }'`  )                   // .(40908.01.1 RAM setPath is called 4 times)
     global.__basedir2  = `${ process.cwd() }`.replace( /[\\\/]/g, '/' ).replace( /^\/([A-Z]):/, '$1:' )    // .(50106.03.2 RAM Assign __BaseDir2 )
         if ("showPaths" != "showPaths") {
              console.log(`  setPaths[1]: __libpath:  '${ __libpath }'`  )
              console.log(`  setPaths[2]: __dirname:  '${ __dirname }'`  )
              console.log(`  setPaths[3]: __basedir:  '${ __basedir }'`  )
              console.log(`  setPaths[4]: __basedir2: '${ __basedir2 }'`  )                                 // .(50106.03.3)
              console.log(`  setPaths[5]: __appname:  '${ __appname }'`  )
              console.log(`  setPaths[6]:  _TS:       '${  _TS      }'`  )
//            console.log(`  setPaths[6]:   aCS:      '${   aCS     }'`  )
              }
       return global.__appname
              } // eif Not running VSCode extension

              }   // eof setPaths()
//  --------------------------------------------------------------

  function  setVars( bDebug_, bQuiet_, bDoit_, bForce_ ) {                              // .(50125.01.1).(50125.01.2 RAM Write setVars Beg)
       var  pVars        = { }
//          bDebug_      = QT(global.bDebug, bDebug_)
            bDebug_      =  bDebug_ ? bDebug_ : process.env["FRT_bDEBUG"] == '1'                                      // .(50206.01.4) RAM Why not check it here too)
            pVars.bDoit  = (bDoit_  ? bDoit_  : process.env["Doit"])  || 0;  bDoit  = pVars.bDoit ; global.bDoit  = bDoit;  // this.bDoit  = bDoit    // .(50201.05.1 RAM Add FRT.bDoit)
            pVars.bDebug = (bDebug_ ? bDebug_ : process.env["Debug"]) || 0;  bDebug = pVars.bDebug; global.bDebug = bDebug; // this.bDebug = bDebug   // .(50201.05.2 RAM Add FRT.bDoit)
            pVars.bQuiet = (bQuiet_ ? bQuiet_ : process.env["Quiet"]) || 0;  bQuiet = pVars.bQuiet; global.bQuiet = bQuiet; // this.bQuiet = bQuiet   // .(50201.05.3 RAM Add FRT.bDoit)
            pVars.bForce = (bForce_ ? bForce_ : process.env["Force"]) || 0;  bForce = pVars.bForce; global.bForce = bForce; // this.bForce = bForce   // .(50215.01.7 RAM Add FRT.bDoit)
//          pVars.bDoit  = QT(global.bDoit,  bDoit_,  process.env["Doit" ]); bDoit  = pVars.bDoit;  global.bDoit  = bDoit;  // this.bDoit  = bDoit    //#.(50201.05.1 RAM Add FRT.bDoit)
//          pVars.bDebug = QT(global.bDebug, bDebug_, process.env["Debug"]); bDebug = pVars.bDebug; global.bDebug = bDebug; // this.bDoit  = bDoit    //#.(50201.05.1 RAM Add FRT.bDoit)
//          pVars.bQuiet = QT(global.bQuiet, bQuiet_, process.env["Quiet"]); bQuiet = pVars.bQuiet; global.bQuiet = bQuiet; // this.bDoit  = bDoit    //#.(50201.05.1 RAM Add FRT.bDoit)
            pVars.usrMsg = usrMsg
            pVars.sayMsg = sayMsg
            pVars.exit_wCR = exit_wCR
            pVars.bQuiet = 2; bQuiet = pVars.bQuiet; global.bQuiet = bQuiet;            // .(50202.01.3 RAM Try this)
    return  pVars
  function  QT(b,c,d) { return (typeof( b ) != 'undefined') ? b : (typeof( c ) != 'undefined' ? c : d) || 0 }
            } // eof setVars                                                            // .(50125.01.2 End)
//  --------------------------------------------------------------

  function  isCalled(    aImportMetaURL, aProcessArgv1 ) {                              // .(50201.04.16)
    return  isNotCalled( aImportMetaURL, aProcessArgv1 ) == false                       // .(50201.04.17)
            }                                                                           // .(50201.04.18)

//function  isCalled(    aImportMetaURL, aProcessArgv1 ) {                              //#.(40802.03.1 RAM Add var names).(50201.04.19)
  function  isNotCalled( aImportMetaURL, aProcessArgv1 ) {                              // .(50201.04.19).(40802.03.1 RAM Add var names)
            aImportMetaURL = aImportMetaURL ? `${aImportMetaURL}` : import.meta.url     // .(40802.03.2 RAM Will be for this script, not calling script)
//          aImportMetaURL = aImportMetaURL ? `${aImportMetaURL}` : __filename          //#.(40819.03.2 RAM CommonJS).(40802.03.2 RAM Will be for this script, not calling script)
            aProcessArgv1  = aProcessArgv1  ? `${aProcessArgv1}`  : process.argv[1]     // .(40802.03.3 RAM Ok for calling script)
       var  aScript1 = aImportMetaURL.split( /[\\\/]/ ).slice(-1)[0]                    // This called script being executed
       var  aScript2 = aProcessArgv1.split(  /[\\\/]/ ).slice(-1)[0]                    // Calling script from another .mjs script or Node command line
//          console.log( `${aScript1}\n${aScript2}`)
    return  aScript1 == aScript2                                                        // .(50201.04.20 RAM Script is not called if this called script == calling script
//  return  aScript1 != aScript2                                                        //#.(50201.04.20 RAM Script is     called if this called script != calling script
            }  // eof isCalled
//  --------------------------------------------------------------

  function  getAppName( __dirname, aName ) {
    return  aName ? aName : __dirname.split( /[\\\/]/ ).pop()
            }   // eof getAppName()
//  --------------------------------------------------------------

       if ('test' == 'text' )  {
//      var pStats    =  await  checkFileASync( '\\e:\\Repos\\Robin\\AICoder_\\dev06-robin\\._2\\FRTs\\AICodeR\\metadata\\AIC80_Apps-n-Model-data.jsonc' )
//      var aUpdateOn =  getDate( pStats.updatedOn )
        var aUpdateOn =  getFileDate( '\\e:\\Repos\\Robin\\AICoder_\\dev06-robin\\._2\\FRTs\\AICodeR\\metadata\\AIC80_Apps-n-Model-data.jsonc' )   // .(50122.06.x)

            console.log( `getDate(       ): ${ getDate(       )}` )  // YMMDD.HHMM
            console.log( `getDate(  0, 0 ): ${ getDate(  0, 0 )}` )  // YYYYMMDD
            console.log( `getDate(  0, 3 ): ${ getDate(  0, 3 )}` )  // YYYYMMDD.HH
            console.log( `getDate(  0    ): ${ getDate(  0    )}` )  // YYYYMMDD.HHMM
            console.log( `getDate(  2, 7 ): ${ getDate(  2, 7 )}` )  // YYMMDD.HHMMSS
            console.log( `getDate(  8, 11): ${ getDate(  8, 11)}` )  // .HHMMSSSSS
            console.log( `getDate( -1, 0 ): ${ getDate( -1, 0 )}` )  // YYYY-MM-DD
            console.log( `getDate( -1    ): ${ getDate( -1    )}` )  // YYYY-MM-DD HH:MM
            console.log( `getDate( -1, 8 ): ${ getDate( -1, 8 )}` )  // YYYY-MM-DD HH:MM.SS
            console.log( `getDate( -1, 12): ${ getDate( -1, 12)}` )  // YYYY-MM-DD HH:MM.SSSSS
            debugger
            }
//  --------------------------------------------------------------

  function  getFileDate( aFilePath, nFmt, nLen  ) {                                     // .(50122.06.x RAM Write getFileDate Beg)
//     var  pStats    =  checkFileSync( '\\e:\\Repos\\Robin\\AICoder_\\dev06-robin\\._2\\FRTs\\AICodeR\\metadata\\AIC80_Apps-n-Model-data.jsonc' )
       var  pStats    =  checkFileSync( aFilePath )
        if (pStats.exists) {                                                            // .(50210.03.1)
       var  aUpdateOn =  getDate( pStats.updatedOn, nFmt ? nFmt : 3, nLen ? nLen : 5 )  //  YMMDD.HHMM
    return  aUpdateOn
       } else {                                                                         // .(50210.03.2)
    return '' }                                                                         // .(50210.03.3 RAM Return '' if file not found)
            }                                                                           // .(50122.06.x End)
//  --------------------------------------------------------------

  function  getDate( nDate, nDateStart, nMinLength, nHrs ) {
        var nHrs        =  nHrs ? ((nHrs == -1) ? new Date().getTimezoneOffset() / 60 : nHrs) : 0
        var nOffset     = (nHrs * 60) * 60 * 1000
        var bDate       = (typeof(nDate) == 'number') && nDate < 15
        if (bDate) {       nHrs = nMinLength; nMinLength = nDateStart; nDateStart = nDate; nDate = null}
        var bFmtDate    =  nDateStart == -1               // nMinLength:  -1)yyyy-mm-dd, 8)hh:mm:ss, 9)hh:mm:sss, 11)hh:mm:sssss
            nDateStart  =  typeof(nDateStart) != 'undefined' ? nDateStart : 3
            nMinLength  =  typeof(nMinLength) != 'undefined' ? nMinLength : ( bFmtDate ? 5 : 5 )
//          aDate       =  aDate ? new Date( isNaN(aDate) ? aDate : (+aDate)           ) : new Date( )
        var dDate       =  nDate ? new Date( isNaN(nDate) ? nDate : (+nDate) - nOffset ) : new Date( )
//          aGTM_Date   =  dDate.toISOString().split( /[-:Z.]/).join( "" ).replace( /T/, "." )
        var aDate       =  `${ `${dDate.getFullYear(     )}` }-`                      // `-`  or ``
                        +  `${ `${dDate.getMonth(   ) + 1 }`.padStart( 2, '0' )}-`   // `-`  or ``
                        +  `${ `${dDate.getDate(         )}`.padStart( 2, '0' )} `   // ` `  or `.`
                        +  `${ `${dDate.getHours(        )}`.padStart( 2, '0' )}:`   // `:`  or ``
                        +  `${ `${dDate.getMinutes(      )}`.padStart( 2, '0' )}.`   // `.`  or ``
                        +  `${ `${dDate.getSeconds(      )}`.padStart( 2, '0' )}`    //
                        +  `${ `${dDate.getMilliseconds( )}`.padStart( 3, '0' )}`    //
        if (bFmtDate) {
//  return `${aDate.substring(0,4)}-${aDate.substring(4,6)}-${aDate.substring(6,8)} ${aDate.substring(9,11)}:${aDate.substring(11,13)}.${aDate.substring(13)}`.substring(0, 11 + nMinLength)
    return  aDate.substring(0, 11 + nMinLength)
       } else {
    return  aDate.replace( /[-:.]/g, "").replace( / /, ".").substring( nDateStart, 8 + nMinLength )
       }    }  // eof getDate()
// --------------------------------------------------------------

     async  function  checkFileASync(  aFilePath  ) {
//          aFilePath        =  aFilePath.match(/^\./) ? path.join( __dirname, aFilePath ) : aFilePath;     // .(40527.01.2 CoPilot Only paths starting with '.' are relative)
//          aFilePath        =  path.resolve( aFilePath.replace( /^\/[A-Z]/, '' ) )                         // .(40721.08.1).(40618.01.1 RA< if path starts with a drive letter, remove the first '/' )
            aFilePath        =  cleanPath( aFilePath );                                                     // .(40721.08.1 RAM Make it the same as checkFileASync).(40618.01.4)
       var  pStats           ={ path: aFilePath.split( /[\\\/]/ ).slice(-1)[0]
                             ,  name: aFilePath.split( /[\\\/]/ ).slice(-1).join()
                             ,  size: 0
                             ,  exists: false
                             ,  updatedOn: ''
                             ,  isNotDir: true
                             ,  isDir: false }
     try {
//     var  aStats           =  await fs.stat(  aFilePath );                                                //#.(50208.06.1)
       var  aStats           =  fsync.statSync( aFilePath );                                                // .(50208.06.2 RAM fs.stat fails in VSCode )
            pStats.size      =  aStats.size
            pStats.updatedOn =  aStats.mtime.toISOString()
            pStats.exists    =  pStats.updatedOn > ""
            pStats.isNotDir  =  aStats.isDirectory() == false
            pStats.isDir     =  aStats.isDirectory() == true
        } catch(pError) {
            console.log( "--- we got an error" ) }                                                          // .(50208.06.3)
    return  pStats
            }   // eof checkFileAsync
// --------------------------------------------------------------

  function  checkFileSync( aFilePath  ) {
            aFilePath       =  cleanPath( aFilePath );                                  // .(40618.01.4)
       var  pStats          ={ path: aFilePath.split( /[\\\/]/ ).slice(-1)[0]
                            ,  name: aFilePath.split( /[\\\/]/ ).slice(-1).join()
                            ,  size: 0
                            ,  exists: false
                            ,  updatedOn: ''
                            ,  isNotDir: true
                            ,  isDir: false }
     try {
       var  aStats          =  fsync.statSync( aFilePath );
            pStats.size     =  aStats.size
            pStats.updatedOn=  aStats.mtime.toISOString()
            pStats.exists   =  pStats.updatedOn > ""
//          pStats.isHidden =  aStats.isHidden == true
            pStats.isNotDir =  aStats.isDirectory() == false
            pStats.isDir    =  aStats.isDirectory() == true
        } catch(pError) { }
    return  pStats
            }   // eof checkFileSync
// --------------------------------------------------------------

     async  function  makDirASync(    aDirName  ) { aDirName = `${aDirName || ''}`
       var  aDirPath        =  aDirName.match( /^\./ ) ? path.join( __dirname, aDirName ) : aDirName;       // .(40527.01.2 CoPilot Only paths starting with '.' are relative)
//          aDirPath        =  path.resolve( aDirPath.replace( /^\/[A-Z]/, '' ) )                           // .(40618.01.1 RA< if path starts with a drive letter, remove the first '/' )
            aDirPath        =  cleanPath( aDirPath )                                                        // .(40618.01.1 RA< if path starts with a drive letter, remove the first '/' )
//     var  pStat           =  await checkFileASync( aDirPath )
     try {
//     var  pOK             =  await fs.access(  aDirPath, fs.constants.F_OK )
//     var  pOK             =  await fs.access(  aDirPath )
//     var  bOK             =  await fs.exists(  aDirPath )
       var  pStats          =  await checkFileASync( aDirPath );                                            //#.(50208.06.4 RAM Fails in VSCode)
//     var  pStats          =        checkFileSync( aDirPath );                                             // .(50208.06.4)
//          console.log(    `  pStats.exists: ${pStats.exists}, ${aDirPath}` )
       var  bOK             =  pStats.isDir //exists // && pStats.isNotDir                                  // .(50208.06.5 RAM Was .exists)
        if (bOK == false) {
        if (this.bDoit == 1) { // for MakDirASync                                                           // .(50201.05b.2).(50201.05.9).(50126.11.21)
//                             fsync.mkdirSync( aDirPath, { recursive: true } );                            //#.(50208.06.6 Use mkDirSync )
                               await fs.mkdir(  aDirPath, { recursive: true } );                            // .(50208.06.6 RAM Fails in VSCode)
            usrMsg(  `  Created directory,  "${aDirName}", successfully!` );
        } else {                                                                                            // .(50126.11.22)
            usrMsg(  `  To create the directory, "${aDirName}", add -d to doit.` );                         // .(50126.11.23)
            }  } // eof bDoit and Dir does not exist                                                        // .(50126.11.24)
        } catch(pError) {
            usrMsg(  `* Error checking directory: ${pError}` );
            aDirPath        = ''
            }
    return  aDirPath;   //  return  aDirPath  to  callers
        }   // eof makDir
// --------------------------------------------------------------

  function  makDirSync(    aDirName  ) { aDirName = `${aDirName || ''}`
       var  aDirPath        =  aDirName.match( /^\./ ) ? path.join( __dirname, aDirName ) : aDirName;       // .(40527.01.2 CoPilot Only paths starting with '.' are relative)
//          aDirPath        =  path.resolve( aDirPath.replace( /^\/[A-Z]/, '' ) )                           // .(40618.01.1 RA< if path starts with a drive letter, remove the first '/' )
            aDirPath        =  cleanPath( aDirPath )                                                        // .(40618.01.1 RA< if path starts with a drive letter, remove the first '/' )
//     var  pStat           =  await checkFileASync(  aDirPath )
     try {
//     var  pOK             =  await fs.access(  aDirPath, fs.constants.F_OK )
//     var  pOK             =  await fs.access(  aDirPath )
//     var  bOK             =  fsync.existsSync( aDirPath )
       var  pStats          =  checkFileSync( aDirPath )
       var  bOK             =  pStats.exists // && pStats.isDir == false
        if (bOK == false) {
        if (this.bDoit == 1) { // for MakDirSync                                                            // .(50201.05b.1 RAM This is FRT).(50201.05.10).(50126.11.25)
            fsync.mkdirSync(      aDirPath, { recursive: true } );
//                             fsync.mkdirSync(  aDirPath, { recursive: true } );
       var  aMsg          = `  Created directory, "${aDirName}", successfully!`;                            // .(50224.01.1 RAM Return msgs)
          } else {                                                                                          // .(50126.11.26)
       var  aMsg          = `  To create the directory, "${aDirName}", add -d to doit.`;                    // .(50224.01.2).(50126.11.27)
            }  } // eof bDoit and Dir does not exist                                                        // .(50126.11.28)
        } catch(pError) {
//          aMsg          = `* Error checking directory, "${aDirName}": ${pError}`;
            aMsg          = `* Failed to create directory, "${aDirName}".`;
            aDirPath        = ''
            }
    return  aMsg  // aDirPath;   //  return  aDirPath  to  callers                                          // .(50224.01.3)
        }   // eof makDir
// --------------------------------------------------------------

     async  function createDirectoryIfNotExists( dirPath ) {                                                // .(50208.06.7 XAI Grok wrote this Beg)
       try {
            await fs.access(dirPath);  // Check if the directory exists
        } catch (error) {
        if (error.code === 'ENOENT') { // If the directory doesn't exist, create it
        if (this.bDoit == 1) { // for MakDirASync                                                           // .(50201.05b.2).(50201.05.9).(50126.11.21)
            try {
                await fs.mkdir(dirPath, { recursive: true });  // Attempt to create the directory
                usrMsg(  `  Created directory,  "${dirPath}", successfully!` );
                return true
            } catch (mkdirError) {

                if (mkdirError.code === 'ENOENT') {  // Handle errors when creating the directory
                    console.error(`Error: The root directory for "${dirPath}" does not exist.`);
                } else {
                    console.error(`Error creating directory: ${mkdirError.message}`);
                }
                return false; // Indicate failure
            }
            } // eif this.bDoit
        } else { // If there's another type of access error
            console.error(`Unexpected error when checking directory: ${error.message}`);
            return false; // Indicate failure
            }
        }
    // If we reach here, the directory either existed or was successfully created
    return  true; // Indicate success

    } // eof createDirectoryIfNotExists                                                                     // .(50208.06.7 End)
// --------------------------------------------------------------

/* Usage
const dirPath = '/path/to/your/directory';
createDirectoryIfNotExists(dirPath).then( result => {
    if (result) {
        console.log('Operation completed successfully.');
    } else {
        console.log('Operation failed.');
    }
}).catch(error => {
    console.error('An unexpected error occurred:', error);
});
*/
//   lastFile( 'E:\Repos\Robin\AIObjs_\._\DOCs\Code-Sessions', /Continue-sessions_u40624\.[0-9]{4}\.json/ )
//   lastFile( 'E:/Repos/Robin/AIObjs_/._/DOCs/Code-Sessions', /Continue-sessions_u30624\.[0-9]{4}\.json/ )

  function  lastFile( aPath, reFind ) {
            reFind    =  typeof(reFind) == 'string' ? new RegExp( reFind.replace( /\\/g, "\\" ) ) : reFind
       var  mFiles1   =  listFiles( aPath )
       var  mFiles2   =  mFiles1.filter( mFile => reFind.test( mFile[2] ) )
            mFiles2   =  mFiles2.sort( (a,b) => a[2] < b[2] ? 1 : -1 )
     return mFiles2[0] ? mFiles2[0][2]: ''
            }  // eof lastFile
// --------------------------------------------------------------

  function  getDir( pattern, aDir ) {                                                   // .(50107.03.1 CAI Claude wrote getDir Beg)
       let  result = ''; aDir = aDir ? aDir : '.'
      try { result = fsync.readdirSync( aDir , { recursive: true } )
                       .find( p => { // console.log( p.includes( pattern ), fsync.statSync( `${aDir}/${p}` ).isDirectory(), p )
                        return fsync.statSync( `${aDir}/${p}` ).isDirectory() && p.includes( pattern ) } ) || '';
        } catch (e) { }
    return  result;
            }                                                                           // .(50107.03.1 End)
// --------------------------------------------------------------

  function  getFile( pattern ) {                                                        // .(50107.03.2 CAI Claude wrote getFile Beg)
       let  result = '';
      try { result = fs.readdirSync('.', { recursive: true })
                       .filter( p => fs.statSync(p).isFile() &&
                   path.basename(p).match( new RegExp( pattern.replace('*', '.*') ) ) )
                       .pop( ) || '';
        } catch (e) {}
    return  result;
            }                                                                           // .(50107.03.2 End)
// --------------------------------------------------------------

  function  setEnv( aVar, aVal, aDir ) {                                                // .(50331.08.1 RAM Add setEnv Beg)
            sayMsg( `AIC98[ 523]  Setting ${aVar} to: '${aVal}'`, -1 )
       var  aEnvFile    =   FRT_path( aDir ? aDir : __basedir2, '.env' ) 
       var  aEnvVar     =   aVar.toUpperCase()
       var  mMyEnvs     =   readFileSync(  aEnvFile, 'ASCII' ).split( /\n/ )
       var  iEnv        =   mMyEnvs.findIndex( aVar => aVar.match( new RegExp( `^ *${aEnvVar}` ) ) )
            mMyEnvs[ iEnv ] = `  ${aEnvVar}="${aVal}"`            
            process.env[    aEnvVar ] = aVal
                            writeFileSync( aEnvFile , mMyEnvs.join( "\n" ) )                     
            }                                                                           // .(50331.08.1 End)
// --------------------------------------------------------------

  function  firstFile( aPath, reFind ) {                                                // .(40827.05.1 RAM Write firstFile)
            reFind  = typeof(reFind) == 'string' ? new RegExp( reFind.replace( /\\/g, "\\" ) ) : reFind
       var  mFiles1 = listFiles( aPath )
       var  mFiles2 = mFiles1.filter( mFile => reFind.test( mFile[2] ) )
            mFiles2 = mFiles2.sort( (a,b) => a[2] < b[2] ? -1 : 1 )                     // .(40827.05.2 RAM Reverse)
     return mFiles2[0] ? mFiles2[0][2]: ''
            }  // eof firstFile
// --------------------------------------------------------------

//  listFiles( '/c/users/robin/.continue/sessions' )
//  listFiles( 'E:\\Repos\\Robin\\AIObjs_\\._\\DOCs\\Code-Sessions' )
//  listFiles( '~/.continue/sessions' )

  function  listFiles( aPath ) {
//           debugger
            aPath     =  FRT_path( aPath )                                              // .(40829.03.1 RAM Was: path.join( cleanpath() ))
        var mFiles1   =  fsync.readdirSync( aPath );
        var mFiles2   = [ ];
   for (var aFile of mFiles1) {
        var aFilePath =  FRT_path( aPath, aFile ); // Join path with filename           // .(40829.03.2)
//      var pStats    =  checkFileSync( aFilePath);
        var pStats    =  fsync.statSync( aFilePath);
            mFiles2.push(
             [  pStats.size.toLocaleString('en-US').padStart(10) // File size in bytes
             ,  getDate( pStats.mtime, -1 ) // Last modification time as a Date object
             ,  aFile
             ,  aPath
                ] );
             } // eol aFile in mFiles1
    return  mFiles2
            }  // eof listFiles
// --------------------------------------------------------------

  function  FRT_path( ...args ) {     return cleanPath( path.join( ...args ) ) }                    // .(40829.03.3 RAM Was: myPath)

  function  cleanPath( aPath ) {
       var  aHome            =  _OS != 'darwin' ? 'HOMEPATH' : 'HOME'                               // .(40910.03.3 RAM Beg)
       var  aRootDir         =  os.homedir().split('/')[0]
//          aPath            =  aPath.replace( /^~/, `${process.env['SystemDrive']}/${process.env['HOMEPATH']}` )                         //#.(40910.03.4)
            aPath            =  aPath.replace( /^~/, os.homedir() )                                 // .(40910.03.3 End)
            aPath            =  aPath.match( /^\./ ) ? path.join( __dirname, aPath ) : aPath;       // .(40527.01.1 CoP Only paths starting with '.' are relative)
//          aPath            =  path.resolve( aPath.replace( /^[\\\/]([A-Za-z])/, '$1:' ) )         // .(40618.01.1 RAM if path starts with a drive letter, replace with '[A=Z]:' )
//          aPath            =  path.resolve( aPath.replace( /^[\\\/]([A-Za-z]):*/, '$1:' ) )       //#.(40618.01.1 RAM if path starts with a drive letter, replace with '[A=Z]:' )// .(40910.03.4)
            aPath            =  path.resolve( aPath.replace( /^[\\\/]([A-Za-z]):+/, '$1:' ) )       // .(40910.03.4).(40618.01.1 RAM if path starts with a drive letter, replace with '[A=Z]:' )
    return  aPath
            }  // eof cleanPath
// --------------------------------------------------------------

     async  function  writeFileASync( aFilePath, aData, pOptions = { encoding: 'utf8' } ) {
//          pOptions         =  pOptions ? pOptions : { encoding: 'utf8' }
            aFilePath        =  cleanPath( aFilePath );                                             // .(40618.01.3)
      try {
        if (typeof( aData ) == 'object') { aData = JSON.stringify( aData, null, 2 ); }
//                          await fsync.writeFile( aFilePath, aData, pOptions);
                                   fsync.writeFileSync( aFilePath, aData, pOptions);
//          console.log(`File '${aFilePath}' written successfully!`);
//turn  Promise.resolve();
        } catch(pError) {
            console.error(   `* Error: Writing file:    "${aFilePath}"` );
            aFilePath       = ''
//turn  Promise.reject(error);
            }
    return  aFilePath
            }  // eof writeFileAsync
// --------------------------------------------------------------

     async  function  writeFileSync( aFilePath, aData, pOptions = { encoding: 'utf8' } ) {
    //      pOptions         =  pOptions ? pOptions : { encoding: 'utf8' }
            aFilePath        =  cleanPath( aFilePath );                                             // .(40618.01.3)
    try {
        if (typeof( aData ) == 'object') { aData = JSON.stringify( aData, null, 2 ); }
    //                          await fsync.writeFile( aFilePath, aData, pOptions);
                                       fsync.writeFileSync( aFilePath, aData, pOptions);
    //      console.log(`File '${aFilePath}' written successfully!`);
    //turn  Promise.resolve();
        } catch(pError) {
            console.error(   `* Error: Writing file:    "${aFilePath}"` );
            aFilePath       = ''
    //turn  Promise.reject(error);
            }
    return  aFilePath
        }   // eof writeFileSync
    // --------------------------------------------------------------

     async  function  readFileASync(   aFilePath, pOptions ) {
            pOptions         =  pOptions  ? pOptions : { encoding: 'utf8' }
            aFilePath        =  cleanPath(  aFilePath );                                            // .(40618.01.5)
      try { aData            = ''
//     if ((await checkFileAsync(    aFilePath ) ).exists) {
       var  bOK              = (await checkFileASync( aFilePath )).exists && (await checkFileASync( aFilePath )).isNotDir
        if (bOK == true) {
       var  aData            =  await fs.readFile( aFilePath, pOptions );
    // var  aData = Promise.resolve( ); // Resolve on success
    //turn  aData
        } else {
            console.error(   `* Error: File not found:  "${aFilePath}"` );
            }
        } catch(pError) {
        if (pError.code === 'ENOENT') {
            console.error(   `* Error: File not found:  "${aFilePath}"` );
        } else {
            console.error(   `* Error: Reading file:    "${pError}"` );
        }   }
    return  aData
            }   // eof readFileAsync
// --------------------------------------------------------------

  function  readFileSync(   aFilePath, pOptions ) {
            pOptions         =  pOptions ? pOptions : { encoding: 'utf8' }
            aFilePath        =  cleanPath( aFilePath );                                             // .(40618.01.6)
      try { aData            = ''
    // var  bOK              =  fsync.existsSync( aFilePath )
       var  bOK              =  checkFileSync( aFilePath ).exists && checkFileSync( aFilePath ).isNotDir
        if (bOK == true) {
       var  aData            =  fsync.readFileSync( aFilePath, pOptions );
        } else {
            console.error(   `* Error: File not found:  "${aFilePath}"` );
            }
    } catch(pError) {
        if (pError.code  ===   'ENOENT') {
            console.error(   `* Error: File not found:  "${aFilePath}"` );
        } else {
            console.error(   `* Error: Reading file:    "${pError}"` );
        }   }
    return  aData
            }  // readFileSync
    // ---------------------------------------------------------------------------------

     async  function  deleteFileASync( aFilePath ) {                                                // .(40801.10.1 RAM Write deleteFileASync Beg)
            aFilePath        =  cleanPath(  aFilePath );                                            // .(40618.01.5)
      try {
       var  bOK              = (await checkFileASync( aFilePath )).exists && (await checkFileASync( aFilePath )).isNotDir
//     var  bOK              =  true                                                                // .(40801.10.9 RAM ???)
        if (bOK == true) {      await fs.unlink( aFilePath );
//      } else {
//          console.error(   `* Error file not found: ${aFilePath}` );
            }
        } catch(pError) {
//      if (pError.code === 'ENOENT') {
//          console.error(   `* Error file not found: ${aFilePath}` );
//      } else {
            console.error(   `* Error deleting file: ${pError}` );
            bOK = false                                                                             // .(50225.03.1)
            }   // }
//  return  aData
            }   // eof deleteFileAsync                                                              // .(40801.10.1 End)
    // --------------------------------------------------------------

  function  deleteFileSync( aFilePath ) {                                                           // .(40801.10.2 RAM Write deleteFileSync Beg)
            aFilePath        =  cleanPath( aFilePath );                                             // .(40618.01.6)
      try {
       var  bOK              =  checkFileSync( aFilePath ).exists && checkFileSync( aFilePath ).isNotDir
        if (bOK == true) {      fsync.unlinkSync( aFilePath );
//      } else {
//          console.error(   `* Error file not found: ${aFilePath}` );
            }
    } catch(pError) {
//      if (pError.code  ===   'ENOENT') {
//          console.error(   `* Error file not found: ${aFilePath}` );
//      } else {
            console.error(   `* Error deleting file: ${pError}` );
            bOK = false                                                                             // .(50225.03.1)
        }   // }
    return  bOK                                                                                     // .(50225.03.2 RAM Return if delete occurs)
            }   // eof deleteFileSync                                                               // .(40801.10.2 End)
// ---------------------------------------------------------------------------------

     async  function  deleteDirASync( aDirPath ) {                                                 // .(50227.01.1 RAM Write deleteDirASync Beg)
            aDirPath         =  cleanPath( aDirPath );                                        
      try {
       var  bOK              = (await checkFileASync( aDirPath )).exists && (await checkFileASync( aDirPath )).isDir
        if (bOK == true) {      await fs.rm( aDirPath, { recursive: true } );
            }
        } catch(pError) {
            console.error(   `* Error deleting folder: ${pError}` );
            bOK = false                                                                        
            } 
        }   // eof deleteDirAsync                                                                   // .(50227.01.1 End)
    // --------------------------------------------------------------

  function  deleteDirSync( aDirPath ) {                                                            // .(40801.10.2 RAM Write deleteDirSync Beg)
            aDirPath         =  cleanPath( aDirPath );                                             
      try {
       var  bOK              =  checkFileSync( aDirPath ).exists && checkFileSync( aDirPath ).isDir
        if (bOK == true) {      fsync.rmSync( aDirPath, { recursive: true } );
            }
    } catch(pError) {
            console.error(   `* Error deleting folder: ${pError}` );
            bOK = false                                                                        
            }
    return  bOK                                                                                
            }   // eof deleteDirSync                                                                // .(50227.01.2 End)
// ---------------------------------------------------------------------------------

     async  function  copyFileASync( aFileFrom, aFileTo, aBackup ) {                                // .(50210.02.1 RAM Write copyDirASync Beg)
            aFileFrom        =  cleanPath( aFileFrom );                                           
            aFileTo          =  cleanPath( aFileTo );                                           
       try {
       var  bOK              =  checkFileSync( aFileFrom ).exists && checkFileSync( aFileFrom ).isNotDir
        if (bOK == true) {      fsync.copyFileSync( aFileFrom, aFileTo );
       var  pStats           =  fsync.statSync(     aFileFrom) ;                                    // Get the source file stats
                                fsync.utimesSync(   aFileTo, pStats.atime, pStats.mtime);           // Set the timestamps of the destination file to match the source
                                }
       } catch( pError ) {
            usrMsg( `* Error copying file: ${pError}` );
            }   // }
        }   // eof copyFileASync                                                                    // .(50210.02.1 End)
// --------------------------------------------------------------

  function  copyFileSync( aFileFrom, aFileTo, aBackup ) {                                           // .(50210.02.2 RAM Write copyFileSync Beg)
            aFileFrom        =  cleanPath( aFileFrom );                                           
            aFileTo          =  cleanPath( aFileTo );                                          
       try { 
        if (aBackup.match( /backup/i )) {
       var  aDate            =  getFileDate( aFileTo )                
        if (aDate) {            copyFile( aFileTo, aFileTo.replace( /^(.*)(\.[^.]+)$/, `$1_v${aDate}$2` ) ); 
            sayMsg( `AIC90[ 633]  Backing up:   ${aFileTo}`, -1 ) }
            }                                                        
       var  bOK              =  checkFileSync( aFileFrom ).exists && checkFileSync( aFileFrom ).isNotDir
        if (bOK == true) {      copyFile( aFileFrom, aFileTo ); }
       } catch( pError ) {
            usrMsg(   `* Error copying file: ${pError}` );
            }   // }
  function  copyFile( aFileFrom,  aFileTo ) {
            sayMsg( `AIC90[ 641]  Copying From: ${aFileFrom}`, -3 )
            sayMsg( `AIC90[ 642]          To:   ${aFileTo}`,   -3 )
                                fsync.copyFileSync( aFileFrom, aFileTo );
       var  pStats           =  fsync.statSync(     aFileFrom ) ;                                   // Get the source file stats
                                fsync.utimesSync(   aFileTo, pStats.atime, pStats.mtime);           // Set the timestamps of the destination file to match the source
             }             
        }   // eof copyFileSync                                                                     // .(50210.02.2 End)
// ---------------------------------------------------------------------------------

     async  function  appendFileASync( aFilePath, aLine ) {                                         // .(50210.02b.1 RAM Write appendFileASync Beg 50302.1112)
            aFilePath =  cleanPath( aFilePath );                                           
      try {
        var  bOK      =  checkFileSync( aFilePath ).exists && checkFileSync( aFilePath ).isNotDir
         if (bOK == true) {     fs.appendFile( aFilePath, aLine );
                                }
    } catch( pError ) {
             usrMsg( `* Error appending file: ${pError}` );
             }   
         }   // eof appendFileASync                                                                 // .(50210.02b.1 End) 
// --------------------------------------------------------------

     async  function  appendFileSync( aFilePath, aLine ) {                                          // .(50210.02b.2 RAM Write appendFileSync)
            aFilePath =  cleanPath( aFilePath );                                           
      try {
        var  bOK      =  checkFileSync( aFilePath ).exists && checkFileSync( aFilePath ).isNotDir
         if (bOK == true) {     fsync.appendFileSync( aFilePath, aLine );
                                }
    } catch( pError ) {
             usrMsg( `* Error appending file: ${pError}` );
             }   
         }   // eof appendFileSync                                                                  // .(50210.02b,2 End)
// --------------------------------------------------------------


     async  function fetchFromOpenAI( aAPI_URL, pMessageObject, aAPI_KEY ) {                        // .(40701.06.1 RAM Add API_URL and API_KEY)
    try {
//          ---------------------------------------------------------
     const  pResponse       =   await fetch( aAPI_URL,
             {  method : 'POST'
             ,  headers:
                 { 'Content-Type' : 'application/json'
                 , 'Authorization': `Bearer ${aAPI_KEY}`
                    }
             ,  body   :  JSON.stringify( pMessageObject )
                } );
//          ---------------------------------------------------------

       if (!pResponse.ok) {
       var  pResponse_err   = { Error: `HTTP Status: ${pResponse.status}, URL: ${aAPI_URL}` }
//          throw new Error(   `Error: ${ pResponse_err.Error }` );
            console.error( `\n* Error: ${ pResponse_err.Error }` );
    return  pResponse_err
            }
//          ---------------------------------------------------------

     const  pResponse_data  =   await pResponse.json();
//          console.log('Response:', pResponse_data);

//          ---------------------------------------------------------

        if (pResponse_data.error) {
       var  pResponse_err   = { Error: `OpenAI API Data message: ${response_data.error.message}, URL: ${aAPI_URL}` }
//          throw new Error(   `Error: ${ pResponse_err.Error }` );
            console.error( `\n* Error: ${ pResponse_err.Error }` );
    return  pResponse_err
            }
//          ---------------------------------------------------------

    return  pResponse_data

//          ---------------------------------------------------------

   } catch( pError) {
       var  pResponse_err   = { Error: `Fetch Message: ${pError.message}, URL: ${aAPI_URL}` }
            console.error( `\n* Error: ${ pResponse_err.Error }` );
    return  pResponse_err
            }
//          ---------------------------------------------------------
  } // eof fetchFromOpenAI
// ---------------------------------------------------------------------------------

  try {
//     var  aAppName    =   setPaths( )                                                                     //#.(40828.02.7 RAM Will it set the global vars? No)
       var  bDebug_AIC90 = 0; _ENV_Debug = 0 // or bDebug or -1                                                                               // .(50213.03.1 RAM bDebug for AIC909) 
//          dotenv.config({ path: FRT.path( __basedir, '.env' ), override: true, debug: _debug } );         //#.(40829.01.4).(40607.02.1 RAM Load environment variables from .env file in script's folder).(40829.03.15)
            sayMsg(        `AIC90[ 757]  __basedir2: '${ __basedir2 }'`,                                        bDebug_AIC90 )  // .(50213.03.2)
            dotenv.config({ path: FRT_path(__basedir2, '.env' ), override: true, debug: _ENV_Debug } );     // .(50126.03.24).(40829.03.15 RAM Was FRT.path).(40829.01.4).(40607.02.1 RAM Load environment variables from .env file in script's folder)
            sayMsg(        `AIC90[ 759]  __basedir:  '${ __basedir  }'`,                                        bDebug_AIC90 )  // .(50213.03.3)
            sayMsg(        `AIC90[ 760]  FRT_.ENV:   '${ process.env['FRT_.ENV'] }'`,                           bDebug_AIC90 )  // .(50213.03.4).(40908.06.1 RAM Must be quoted name)
//          sayMsg(        `AIC90[ 761] .env:        '${ cleanPath( path.join( __basedir, '.env' ) ) }'`)                       //#.(40829.03.9)
            sayMsg(        `AIC90[ 762] .env:        '${ FRT_path(__basedir2, '.env' ).replace( /\\/, '/') }'`, bDebug_AIC90 )  // .(50213.03.5).(50126.03.25).(40829.03.16 RAM Was FRT.path).(40829.03.4)
            sayMsg(        `AIC90[ 763]  process.env['FRT_APPNAME'] : '${ process.env['FRT_APPNAME'] }'` ,      bDebug_AIC90 )
            sayMsg(        `AIC90[ 764]  process.env['FRT_MODEL'  ] : '${ process.env['FRT_MODEL'  ] }'` ,      bDebug_AIC90 )
//          Object.freeze(process.env); // Lock it after loading
//          console.log( '' )
       } catch(error) {
            sayMsg(        `AIC90[ 710]:  * An error has occured in the imported module`)
            }
//   -- --  ---------------  =  ------------------------------------------------------  #  ---------------- #

//          dotenv.config( { path: path.join( __basedir, '.env' ) } );                                      //#.(40607.02.1 RAM Load environment variables from .env file in script's folder)
//  export  default { getDate, _TS, checkFileASync }
//     var  pFileFns = { setPaths, readFile, readFile2, writeFile, getDate }

       var  pFRT =                                                                                          // .(40819.03.3 RAM Use for both types of exports)
         {  setPaths, firstFile, lastFile, listFiles, getAPI: fetchFromOpenAI
         ,  getDate,  getFileDate, join: path.join,  path: FRT_path,  _TS                                   // .(50122.06.2).(40829.03.4).(40827.05.3 RAM Add)
         ,  checkFileSync,  checkFileASync,  checkFile:  checkFileASync
         ,  writeFileSync,  writeFileASync,  writeFile:  writeFileASync
         ,  readFileSync,   readFileASync,   readFile:   readFileASync
         ,  deleteDirSync,  deleteDirASync,  deleteDir:  deleteDirSync                                      // .(50227.01.1 RAM Was: mak fns).(50208.06.8)
         ,  makDirSync,     makDirASync,     makDir:     createDirectoryIfNotExists                         // .(50208.06.8)
         ,  deleteFileSync, deleteFileASync, deleteFile: deleteFileSync                                     // .(40801.10.3)
         ,  appendFileSync, appendFileASync, appendFile: appendFileSync                                     // .(50210.02b.3)
         ,  copyFileSync,   copyFileASync,   copyFile:   copyFileSync                                       // .(50210.02.3)
         ,  setEnv, getDir, getFile, setVars, isCalled, isNotCalled                                         // .(50331.08.2).(50201.04.21 RAM Added isNotCalled).(50125.01.9).(50107.03.3)
         ,  __basedir:  __basedir, __dirname: __dirname,  AppName: aAppName                                 // .(40827.06.x ??).(40819.10.x RAM Add them to FRT)
         ,  __basedir2: __basedir2, exit_wCR                                                                // .(50129.02.3).(50126.03.23)
         ,  bDoit: bDoit, bDebug: bDebug, bQuiet: bQuiet, bForce: bForce                                    // .(50215.01.8 RAM Set bForce)
         ,  sayMsg, usrMsg, setSay, say                                                                     // .(50218.01.10).(50210.02.4)
            }
//      --  ---------------  =  ------------------------------------------------------  #

    export  default pFRT                                                                                    // .(40819.03.5)

/*========================================================================================================= #  ===============================  *\
#>      AIC90 END
\*===== =================================================================================================== */
/*\
##SRCE     +====================+===============================================+
##RFILE    +====================+=======+===================+======+=============+
\*/