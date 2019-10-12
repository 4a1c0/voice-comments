// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Function that adds the comment above the current line with indentation
function addComment (option: string) {


	

	var editor = vscode.window.activeTextEditor;
	if (editor){
		var localEditor = editor;
  
		vscode.commands.executeCommand('acceptSelectedSuggestion').then(() => {
			const position = localEditor.selection.active;
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
