// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';

import { spawn } from 'child_process';
import { platform } from 'os';
import { join } from 'path';
import * as vscode from 'vscode';
//import { pipeline } from 'stream';


// FUNCTION	THAT ADDS THE COMMENT IN THE CURRENT LINE (INLINE)																				
function addCommentSide (option: string) {														// The only input is going to be string with the recognized speech

	var editor = vscode.window.activeTextEditor;												// In variable editor the current editor is stored 			
	if (editor){																				// If the editor exists
		var localEditor = editor;																// Store it in an aux variable (to avoid overwritting)
		const position = localEditor.selection.active;											// In variable position the position of current writting point (pointer) is stored
		vscode.commands.executeCommand('acceptSelectedSuggestion').then(() => {					// helpito				
			
			vscode.commands.executeCommand('editor.action.insertLineAfter').then(() => {		// command to write the commentary inline
				var lineIndex = localEditor.selection.active.line;								// store the line where the cursor is right now (where the comment must be written)
				var lineObject = localEditor.document.lineAt(lineIndex);						// insert new line 
				var line = lineObject.text;														// the line of code that has to be commented is stored
				var insertionSuccess = localEditor.edit((editBuilder) => {						// 
				editBuilder.insert(new vscode.Position(lineIndex, 0), option);					// the speech string input (option) is in serted in the very begining of the new line (the one that was inserted)
				
				});
		
				if (!insertionSuccess) {return;}												//if insertion fails, skip
				vscode.commands.executeCommand('editor.action.commentLine').then(() => {		//
					var lineObjectComment = localEditor.document.lineAt(lineIndex);				//from the line where the string was inserted 
					var lineComment = lineObjectComment.text;									//the string is stored in a var
					localEditor.edit((editBuilder) => {
						editBuilder.insert(new vscode.Position(lineIndex-1, line.length + 9999999 ), '  ' + lineComment); //the stored text is inserted on the very right of the actual code
						
					});
					
					var pos = new vscode.Position(position.line, position.character);
					var posComment = new vscode.Position(position.line+1, position.character);
					var commentSelection = new vscode.Selection(posComment, posComment);
					var newSelection = new vscode.Selection(pos, pos);
					localEditor.selection = commentSelection;
					vscode.commands.executeCommand('editor.action.deleteLines').then(() => {
						localEditor.selection = newSelection;
					});
					
				});
				
				
			});
		});
	}else {
		return;
	}
}

// FUNCTION THAT ADDS THE COMMENT ABOVE THE CURRENT LINE WITH IDENTATION 
function addComment (option: string) {															

	var editor = vscode.window.activeTextEditor;												
	if (editor){																				
		var localEditor = editor;																
		const position = localEditor.selection.active;											
		vscode.commands.executeCommand('acceptSelectedSuggestion').then(() => {									
			
			vscode.commands.executeCommand('editor.action.insertLineBefore').then(() => {		// helpito attempt to execute the command to write in the line above
				var lineIndex = localEditor.selection.active.line;								// the current (line) position is stored
				var lineObject = localEditor.document.lineAt(lineIndex);						// helpito a new line is inserted above the current working line
				var indentation = lineObject.text.length;										// the legth of the line of code (current line) being commented is stored
				var insertionSuccess = localEditor.edit((editBuilder) => {						// the file gets edited in the current position (where the new line was inserted) by
				editBuilder.insert(new vscode.Position(lineIndex, indentation), option);		// the input (option, a strng with the speech recognized) in inserted in the original line (above the code)
				
				});
		
				if (!insertionSuccess) {return;}												// if the insertion of the commentary failed we skip
				vscode.commands.executeCommand('editor.action.commentLine').then(() => {		// The inserted line will be transformed into a commentary
					var pos = new vscode.Position(position.line+1, position.character);			// helpito
					var newSelection = new vscode.Selection(pos, pos);
					localEditor.selection = newSelection;
				});
				
				
			});
		});
	}else {
		return;
	}
}

function showJErrorMsg() {
	vscode.window.showInformationMessage('Please install Python3 in order to run this extension!!!'); 		// if the commands couldn't be executed we show error
}


// function listen(context: vscode.ExtensionContext){
// 	let checkJRE = false;
// 	// window.showInformationMessage('This is Voice Command! activated');
// 	const checkJREprocess = spawn('python3', ['--version']).on('error', err => showJErrorMsg());
// 	checkJREprocess.stderr.on('data', (data: Buffer) => {
// 		// console.log(data.toString())
// 		if (data.indexOf('n 3') >= 0) { checkJRE = true; }
// 		checkJREprocess.kill();
// 	});
// 	checkJREprocess.on('exit', (code, signal) => {
// 		if (checkJRE === true) { var listener = new VoiceListener(context, platform()); }
// 		else { showJErrorMsg(); }
// 	});
// }

class SttBarItemSide {																				// Icon shown on the bottom bar to enable the recording functions (inline commentary)
	private statusBarItem: vscode.StatusBarItem;
	private stt: string; 
  
	constructor() {																					// The Icon/button constructor
	  this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
	  this.stt = "off";																				// the atribute state is set to off
	  this.off();
	}
  
	on() {																							// on method is declared
	  this.statusBarItem.text = '💬 side listening';												// declaration of the text for the on method
	  this.statusBarItem.show();																	// the text is printed to show it's on												
	  this.stt = 'on';																				// the status in on since it is listening
	}
  
	off() {																							// off method
	  this.statusBarItem.text = '✖️️ side stop';													// declaration of the text for the off method
	  this.statusBarItem.show();																	// the text is printed to show it's off			
	  this.stt = 'off';																				// the status in off, recording stopped
	}

  
	getSttText() {																					//returns status (on/off)
	  return this.stt;
	}
  
	setSttCmd(cmd: string | undefined) {															//helpito
	  this.statusBarItem.command = cmd;
	}
  }


// THIS CLASS AND FUCTIONS DO THE SAME AS THE ONE ABOVE BUT FOR THE WRITTING COMMENT ABOVE

class SttBarItem {																					
	private statusBarItem: vscode.StatusBarItem;
	private stt: string;
  
	constructor() {
	  this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
	  this.stt = "off";
	  this.off();
	}
  
	on() {
	  this.statusBarItem.text = '💬 listening';
	  this.statusBarItem.show();
	  this.stt = 'on';
	}
  
	off() {
	  this.statusBarItem.text = '✖️️ Stop';
	  this.statusBarItem.show();
	  this.stt = 'off';
	}

  
	getSttText() {
	  return this.stt;
	}
  
	setSttCmd(cmd: string | undefined) {
	  this.statusBarItem.command = cmd;
	}
  }

class VoiceListenerSide {
private sysType: String;																								// OS is being ran
// @ts-ignore
private execFile;																										// file (code)
// @ts-ignore
private child;																											// recording process
private side = false;																									// assume is not gonna be inline comment
private sttbar: SttBarItemSide;  																						// initialize icon bar icon
constructor(context: vscode.ExtensionContext, type: String, lang: String) {												// constructor with OS type and language
	this.sysType = type;
	this.execFile = spawn;
	this.sttbar = new SttBarItemSide();
	const d1 = vscode.commands.registerCommand('toggleS', () => {
	if (this.sttbar.getSttText() === 'on') {
		this.sttbar.off();
		this.killed();
	} else {
		this.sttbar.on();
		this.run(lang);
	}
	});
	const d2 = vscode.commands.registerCommand('stop_listenS', () => {
	this.sttbar.off();
	this.killed();
	});
	context.subscriptions.concat([d1, d2]);
	this.sttbar.setSttCmd('toggleS');
}

run(lang: String) {
	if (this.sysType === 'win32') {																						// if windows is being used
	// console.log('Using Microsoft Speech Platform')
	this.child = this.execFile(join(__dirname, 'WordsMatching.exe')).on('error', (error: any) => showError(error));		// the program words matching is executed to write the text form voice, 
	} else {
	// console.log('Using CMUSphinx Voice Recognition')
	this.child = this.execFile('python3', [ join(__dirname, '../speech/speechTest.py'),lang.toString()]).on('error', (error: any) => showError(error));		//if windows is not being used we use the python script to recognize the voice
	}
	this.child.stdout.on('data',																						// the data from the recording, stored in the Buffer is transformed to a strng
	(data: Buffer) => {
		vscode.window.setStatusBarMessage(data.toString(), 1000);
		console.log(data.toString());																					// the string is shown in the console
		addCommentSide(data.toString().trimRight());																	// the defined function to add the comment to the side (inline) is called
	});

	this.child.stderr.on('data', (data: any) => showError(data.toString()));

	function showError(error: any) {																					// error detection
	vscode.window.showInformationMessage(`Something went wrong Sorry 😢 - ${error}`);
	}
}

killed() {																												// process gets killed
	this.child.stdin.write('sda');																						// some notification printed
	this.child.stdin.end();
	//this.child.kill();
}
}

// THIS CLASS AND FUCTIONS DO THE SAME AS THE ONE ABOVE BUT FOR THE WRITTING COMMENT ABOVE

class VoiceListener {
	private sysType: String;																							
	// @ts-ignore
	private execFile;																									
	// @ts-ignore
	private child;																										
	private side = false;																								
	private sttbar: SttBarItem; 																						
	constructor(context: vscode.ExtensionContext, type: String, lang: String) {
	  this.sysType = type;																							
	  this.execFile = spawn;
	  this.sttbar = new SttBarItem();
	  const d1 = vscode.commands.registerCommand('toggle', () => {
		if (this.sttbar.getSttText() === 'on') {
			this.sttbar.off();
			this.killed();
		} else {
			this.sttbar.on();
			this.run(lang);
		}
	  });
	  const d2 = vscode.commands.registerCommand('stop_listen', () => {
		this.sttbar.off();
		this.killed();
	  });
	  context.subscriptions.concat([d1, d2]);
	  this.sttbar.setSttCmd('toggle');
	}
  
	run(lang: String) {
	  if (this.sysType === 'win32') {
		// console.log('Using Microsoft Speech Platform')
		this.child = this.execFile(join(__dirname, 'WordsMatching.exe')).on('error', (error: any) => showError(error));
	  } else {
		// console.log('Using CMUSphinx Voice Recognition')
		this.child = this.execFile('python3', [ join(__dirname, '../speech/speechTest.py'), lang.toString()]).on('error', (error: any) => showError(error));
	  }
	  this.child.stdout.on('data',
		(data: Buffer) => {
		  vscode.window.setStatusBarMessage(data.toString(), 1000);
		  console.log(data.toString());
		  addComment(data.toString().trimRight());
		});
  
	  this.child.stderr.on('data', (data: any) => showError(data.toString()));
  
	  function showError(error: any) {
		vscode.window.showInformationMessage(`Something went wrong Sorry 😢 - ${error}`);
	  }
	}
  
	killed() {
		this.child.stdin.write('sda');
		this.child.stdin.end();
	  //this.child.kill();
	}
  }
  


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const lang: string = (vscode.workspace.getConfiguration().get('extension.language') === undefined)? 'en-US': String(vscode.workspace.getConfiguration().get('extension.language'));

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "voice-comments" is now active!');

	var comment = vscode.commands.registerCommand('extension.comment', () => {
		addComment('Comment');
	});

	context.subscriptions.push(comment);

	var sideComment = vscode.commands.registerCommand('extension.iComment', () => {
		addCommentSide('Side Comment');
	});

	context.subscriptions.push(sideComment);


	var listen = vscode.commands.registerCommand('extension.voiceComment', () => {
		let checkJRE = false;
		// window.showInformationMessage('This is Voice Command! activated');
		const checkJREprocess = spawn('java', ['-version']).on('error', err => showJErrorMsg());
		checkJREprocess.stderr.on('data', (data: Buffer) => {
			// console.log(data.toString())
			if (data.indexOf('version') >= 0) { checkJRE = true; }
			checkJREprocess.kill();
		});
		checkJREprocess.on('exit', (code, signal) => {
			if (checkJRE === true) { var listener = new VoiceListener(context, platform(), lang); }
			else { showJErrorMsg(); }
		});
	});

	context.subscriptions.push(listen);

	var sideListen = vscode.commands.registerCommand('extension.iVoiceComment', () => {
		let checkJRE = false;
		// window.showInformationMessage('This is Voice Command! activated');
		const checkJREprocess = spawn('java', ['-version']).on('error', err => showJErrorMsg());
		checkJREprocess.stderr.on('data', (data: Buffer) => {
			// console.log(data.toString())
			if (data.indexOf('version') >= 0) { checkJRE = true; }
			checkJREprocess.kill();
		});
		checkJREprocess.on('exit', (code, signal) => {
			if (checkJRE === true) { var listener = new VoiceListenerSide(context, platform(), lang); }
			else { showJErrorMsg(); }
		});
	});

	context.subscriptions.push(sideListen);
}

// this method is called when your extension is deactivated
export function deactivate() {}
