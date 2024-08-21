/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import MacheteDocument from './machetedocument';
import { TextDocument } from 'vscode';

export default class Provider implements vscode.TextDocumentContentProvider {

	static scheme = 'machete';
	private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
	private _document : undefined | MacheteDocument;
	private _editorDecoration = vscode.window.createTextEditorDecorationType({ textDecoration: 'underline' });
	 

	constructor() {

	}

	// Expose an event to signal changes of _virtual_ documents
	// to the editor
	get onDidChange() {
		
		return this._onDidChange.event;
	}
	dispose() {
		this._document!.dispose();
		this._editorDecoration.dispose();
		this._onDidChange.dispose();
	}

    next() {
        this._document!.next();
    }
    previous() {
        this._document!.previous();
    }

	// Provider method that takes an uri of the machete scheme and
	// returns part of the json document that can be cycled through.
	provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {


		// already loaded?
		let document = this._document;
		if (document) {
			var stringed = JSON.stringify(document.value, undefined, 4);
			return stringed;
		}
		const created = vscode.workspace.openTextDocument(
			decodeLocation(uri)).then((opendocument) => {
				document = new MacheteDocument(opendocument, uri, this._onDidChange);
				this._document = document;
				
				var stringed = JSON.stringify(document.value, undefined, 4);
				return stringed;
			}
			);
        return created;
	}
}



let seq = 0;

export function encodeLocation(uri: vscode.Uri, pathname:string): vscode.Uri {
	const query = encodeURI(uri.toString());
	return vscode.Uri.parse(`${Provider.scheme}:"${pathname}"?${query}#${seq++}`);
}

export function decodeLocation(uri: vscode.Uri): vscode.Uri {
	return vscode.Uri.parse(uri.query);
}