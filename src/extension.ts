// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commands, window, workspace } from 'vscode';
import Provider, { encodeLocation } from './provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jsonmachete" is now active!');


	const provider = new Provider();
	// register content provider for scheme `references`
	// register document link provider for scheme `references`
	const providerRegistrations = vscode.Disposable.from(
		workspace.registerTextDocumentContentProvider(Provider.scheme, provider),
	);
	// register command that crafts an uri with the `references` scheme,
	// open the dynamic document, and shows it in the next editor
	const commandRegistration = commands.registerTextEditorCommand('jsonmachete.jsonmachete', editor => {
		const uri = encodeLocation(editor.document.uri, editor.document.fileName);
		return workspace.openTextDocument(uri).then(doc => {
			window.showTextDocument(doc, editor.viewColumn! + 1);
			vscode.languages.setTextDocumentLanguage(doc, "json");
			commands.executeCommand("vscode.executeFormatDocumentProvider", uri);

		});
	});
	const commandRegistrationNext = commands.registerTextEditorCommand('jsonmachete.next', editor => {
		provider.next();
	});

	const commandRegistrationPrev = commands.registerTextEditorCommand('jsonmachete.previous', editor => {
		provider.previous();
	});

	context.subscriptions.push(provider, commandRegistration, commandRegistrationNext, commandRegistrationPrev, providerRegistrations);
}

// This method is called when your extension is deactivated
export function deactivate() { }
