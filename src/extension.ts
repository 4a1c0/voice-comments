// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';

import { spawn } from 'child_process';
import { platform } from 'os';
import { join } from 'path';
import * as vscode from 'vscode';
import { pipeline } from 'stream';


// Function that adds the comment above the current line with indentation
function addComment (option: string) {

	var editor = vscode.window.activeTextEditor;
	if (editor){
		var localEditor = editor;
		const position = localEditor.selection.active;
		vscode.commands.executeCommand('acceptSelectedSuggestion').then(() => {
			
			vscode.commands.executeCommand('editor.action.insertLineBefore').then(() => {
				var lineIndex = localEditor.selection.active.line;
				var lineObject = localEditor.document.lineAt(lineIndex);
				var indentation = lineObject.text.length;
				var insertionSuccess = localEditor.edit((editBuilder) => {
				editBuilder.insert(new vscode.Position(lineIndex, indentation), option);
				
				});
		
				if (!insertionSuccess) {return;}
				vscode.commands.executeCommand('editor.action.commentLine').then(() => {
					var pos = new vscode.Position(position.line+1, position.character);
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
	vscode.window.showInformationMessage('Please install JRE(JDK for MacOS) in order to run this extension!!!');
}


function listen(context: vscode.ExtensionContext){
	let checkJRE = false;
	// window.showInformationMessage('This is Voice Command! activated');
	const checkJREprocess = spawn('java', ['-version']).on('error', err => showJErrorMsg());
	checkJREprocess.stderr.on('data', (data: Buffer) => {
		// console.log(data.toString())
		if (data.indexOf('version') >= 0) { checkJRE = true; }
		checkJREprocess.kill();
	});
	checkJREprocess.on('exit', (code, signal) => {
		if (checkJRE === true) { var listener = new VoiceListener(context, platform()); }
		else { showJErrorMsg(); }
	});
}

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

class VoiceListener {
	private sysType: String;
	// @ts-ignore
	private execFile;
	// @ts-ignore
	private child;
	private sttbar: SttBarItem;
  
	constructor(context: vscode.ExtensionContext, type: String) {
	  this.sysType = type;
	  this.execFile = spawn;
	  this.sttbar = new SttBarItem();
	  const d1 = vscode.commands.registerCommand('toggle', () => {
		if (this.sttbar.getSttText() === 'on') {
		  this.sttbar.off();
		  this.killed();
		} else {
		  this.sttbar.on();
		  this.run();
		}
	  });
	  const d2 = vscode.commands.registerCommand('stop_listen', () => {
		this.sttbar.off();
		this.killed();
	  });
	  context.subscriptions.concat([d1, d2]);
	  this.sttbar.setSttCmd('toggle');
	}
  
	run() {
	  if (this.sysType === 'win32') {
		// console.log('Using Microsoft Speech Platform')
		this.child = this.execFile(join(__dirname, 'WordsMatching.exe')).on('error', (error: any) => showError(error));
	  } else {
		// console.log('Using CMUSphinx Voice Recognition')
		this.child = this.execFile('python3', [ join(__dirname, '../speech/speechTest.py')]).on('error', (error: any) => showError(error));
	  }
	  this.child.stdout.on('data',
		(data: Buffer) => {
		  vscode.window.setStatusBarMessage(data.toString(), 1000);
		  //let centralCmd = new CommandsClass();
		  console.log(data.toString());
		  addComment(data.toString().trimRight());
		  //centralCmd.runCmd(data.toString().trim());

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

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "voice-comments" is now active!');

	var comment = vscode.commands.registerCommand('extension.comment', () => {
		addComment('Coment');
	});
	context.subscriptions.push(comment);

	var listen = vscode.commands.registerCommand('extension.listen', () => {
		let checkJRE = false;
		// window.showInformationMessage('This is Voice Command! activated');
		const checkJREprocess = spawn('java', ['-version']).on('error', err => showJErrorMsg());
		checkJREprocess.stderr.on('data', (data: Buffer) => {
			// console.log(data.toString())
			if (data.indexOf('version') >= 0) { checkJRE = true; }
			checkJREprocess.kill();
		});
		checkJREprocess.on('exit', (code, signal) => {
			if (checkJRE === true) { var listener = new VoiceListener(context, platform()); }
			else { showJErrorMsg(); }
		});
	});
	context.subscriptions.push(listen);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.voiceComment', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('This is a Comment!');
	});



	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
