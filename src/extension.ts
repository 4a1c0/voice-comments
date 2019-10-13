// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';

import { spawn, execFile, execFileSync } from 'child_process';
import { platform } from 'os';
import { join } from 'path';
import * as vscode from 'vscode';
//import { pipeline } from 'stream';


// FUNCTION	THAT ADDS THE COMMENT IN THE CURRENT LINE (INLINE)																				
function addCommentSide (option: string) {														// The only input is going to be string with the recognized speech

	var editor = vscode.window.activeTextEditor;												// In variable editor the current editor is stored 			
	if (editor){																				// If the editor exists
		var localEditor = editor;																// Store it in an aux variable (to avoid using an uninitialized variable)
		const position = localEditor.selection.active;											// In the position variable the location of current writting point (cursor) is stored
		vscode.commands.executeCommand('editor.action.insertLineAfter').then(() => {			// command to write the commentary inline
			var lineIndex = localEditor.selection.active.line;									// store the line where the cursor is right now (where the comment must be written)
			var lineObject = localEditor.document.lineAt(lineIndex);							// insert new line 
			var line = lineObject.text;															// the line of code that has to be commented is stored
			var insertionSuccess = localEditor.edit((editBuilder) => {							// 
			editBuilder.insert(new vscode.Position(lineIndex, 0), option);						// the speech string input (option) is in serted in the very begining of the new line (the one that was inserted)
			
			});
	
			if (!insertionSuccess) {return;}													//if insertion fails, skip
			vscode.commands.executeCommand('editor.action.commentLine').then(() => {			//
				var lineObjectComment = localEditor.document.lineAt(lineIndex);					//from the line where the string was inserted 
				var lineComment = lineObjectComment.text;										//the string is stored in a var
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
		vscode.commands.executeCommand('editor.action.insertLineBefore').then(() => {		// execute the command to add a the line above the current cursor, then
			var lineIndex = localEditor.selection.active.line;								// the number of the current (new added line) position is stored
			var lineObject = localEditor.document.lineAt(lineIndex);						// get the contents of the current line
			var indentation = lineObject.text.length;										// the legth of the line of code (only the indentation) being commented is stored
			var insertionSuccess = localEditor.edit((editBuilder) => {						// the file is modified in the current position (where the new line was inserted) by inserting
			editBuilder.insert(new vscode.Position(lineIndex, indentation), option);		// the input (option, a strng with the speech recognized) in inserted in the original line (above the code)
			});
	
			if (!insertionSuccess) {return;}												// if the insertion of the commentary failed we skip
			vscode.commands.executeCommand('editor.action.commentLine').then(() => {		// The inserted line will be transformed into a commentary
				var pos = new vscode.Position(position.line+1, position.character);			// the cursors is brought back to the original position before ending the recordinfg
				var newSelection = new vscode.Selection(pos, pos);							// a new instance of a position object gets created
				localEditor.selection = newSelection;										// and assigned to the current editor
			});

		});
	}else {																					// if no editor skips the addition of comment
		return;
	}
}
// Function to show notification about the necessary dependences for the extension to work
function showPErrorMsg() {
	vscode.window.showInformationMessage('Please install Python3 + Speach_Recognition + PyAudio in order to run this extension!!!'); 		// if the commands couldn't be executed we show error
}

// Class that represents the Icon shown on the bottom bar to enable the recording functions (inline commentary)
class SttBarItemSide {																				
	private statusBarItem: vscode.StatusBarItem;													// Necessary private variables
	private stt: string; 
  
	constructor() {																					// The Icon/button constructor
	  this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);	// Spawnig of the button in the stattus bar
	  this.stt = "off";																				// the atribute state is set to off
	  this.off();
	}
  
	on() {																							// on method is declared
	  this.statusBarItem.text = '🎙side listening';												// declaration of the text for the on method
	  this.statusBarItem.show();																	// the text is printed to show it's on												
	  this.stt = 'on';																				// the status in on since it is listening
	}
  
	off() {																							// off method
	  this.statusBarItem.text = '✖️️ Side Stop';													// declaration of the text for the off method
	  this.statusBarItem.show();																	// the text is printed to show it's off			
	  this.stt = 'off';																				// the status in off, recording stopped
	}

  
	getSttText() {																					//returns status (on/off)
	  return this.stt;
	}
  
	setSttCmd(cmd: string | undefined) {															// set the command to execute on click
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
	  this.statusBarItem.text = '🎙listening';
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
// Object that implements the call to the speech recognition script and toggles the button
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
	this.sttbar = new SttBarItemSide();																					// Generates a Status bar button
	const toggl = vscode.commands.registerCommand('toggleS', () => {													// Registers the toggleSide command
	if (this.sttbar.getSttText() === 'on') {																			// if it's on turn it off
		this.sttbar.off();
		this.killed();																									// call to stop the recording 
	} else {																											// if it's off turn it on
		this.sttbar.on();
		this.run(lang);																									// call to start the recording with the language configuration
	}
	});
	context.subscriptions.push(toggl);																					// publish the command
	this.sttbar.setSttCmd('toggleS');																					// set the command to toggle at click
}

run(lang: String) {
	if (this.sysType === 'some day'){		//'win32') {																// if windows is being used (not implemented yet)
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
	vscode.window.showInformationMessage(`Something went wrong - ${error}`);
	}
}

killed() {																												// process gets killed
	this.child.stdin.write('die');																						// some notification printed
	this.child.stdin.end();
	//this.child.kill();
}
}

// THIS CLASS AND FUCTIONS DO THE SAME AS THE ONE ABOVE BUT FOR THE WRITTING COMMENT ABOVE except the addComment call 

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
	  const tggl = vscode.commands.registerCommand('toggle', () => {
		if (this.sttbar.getSttText() === 'on') {
			this.sttbar.off();
			this.killed();
		} else {
			this.sttbar.on();
			this.run(lang);
		}
	  });
	  context.subscriptions.push(tggl);
	  this.sttbar.setSttCmd('toggle');
	}
  
	run(lang: String) {
	  if (this.sysType === 'some day'){		//'win32') {
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
		  addComment(data.toString().trimRight());	// Add comment at the upper line
		});
  
	  this.child.stderr.on('data', (data: any) => showError(data.toString()));
  
	  function showError(error: any) {
		vscode.window.showInformationMessage(`Something went wrong - ${error}`);
	  }
	}
  
	killed() {
		this.child.stdin.write('die');
		this.child.stdin.end();
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


	var listen = vscode.commands.registerCommand('extension.voiceComment', () => {						// registers the above line voice comment
		let checkPython = false;																		// checks if the dependences are installed and notifies the user to install them
		const checkPythonprocess = execFile('python3', ['-c','import sys; import speech_recognition; print(sys.version_info[0]); sys.stdout.flush()']).on('error', err => showPErrorMsg());
		checkPythonprocess.stdout.on('data', (data: Buffer) => {
			if (data.indexOf('3') >= 0) { checkPython = true; }											// using pithon3
			checkPythonprocess.kill();
		});
		checkPythonprocess.on('exit', (code, signal) => {
			if (checkPython === true) { var listener = new VoiceListener(context, platform(), lang); }	// Init the voice listener
			else { showPErrorMsg(); }
		});
	});

	context.subscriptions.push(listen);

	var sideListen = vscode.commands.registerCommand('extension.iVoiceComment', () => {					// registers the above side line voice comment equal to the one before changing the object that instatiates
		let checkPython = false;
		const checkPythonprocess = execFile('python3', ['-c','import sys; import speech_recognition; print(sys.version_info[0]); sys.stdout.flush()']).on('error', err => showPErrorMsg());
		checkPythonprocess.stdout.on('data', (data: Buffer) => {
			if (data.indexOf('3') >= 0) { checkPython = true; }
			checkPythonprocess.kill();
		});
		checkPythonprocess.on('exit', (code, signal) => {
			if (checkPython === true) { var listener = new VoiceListenerSide(context, platform(), lang); }
			else { showPErrorMsg(); }
		});
	});

	context.subscriptions.push(sideListen);
}

// this method is called when your extension is deactivated
export function deactivate() {}
