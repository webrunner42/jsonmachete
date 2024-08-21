/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import Provider from './provider';
import { TextDocument } from 'vscode';
export default class MacheteDocument {

    private _document: vscode.TextDocument | undefined;
    private _subdocuments: Map<string, string> | Array<string> | undefined;
    private _current: number;
    private readonly _uri: vscode.Uri;

    private readonly _emitter: vscode.EventEmitter<vscode.Uri>;
    private _length = 0;
    
    constructor(document: TextDocument, myuri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>) {
        this._uri = myuri;
        // The ReferencesDocument has access to the event emitter from
        // the containing provider. This allows it to signal changes
        this._emitter = emitter;
        this._current = 0;
        this._document = document;
        const parsed = JSON.parse(this._document.getText());

        if (Array.isArray(parsed)) {
            this._subdocuments = parsed;
            this._length = parsed.length;
        }
        else {
            ;
            var count = 0;

            this._subdocuments = new Map<string, string>();
            for (var prop in parsed) {
                this._subdocuments.set(prop, parsed[prop]);
                count++;
            }
            this._length = count;
        }
        this._emitter.fire(this._uri);
    };






    get value() {
        if (this._subdocuments === undefined) {
            return "";
        }
        else if (Array.isArray(this._subdocuments)) {
            return this._subdocuments[this._current];
        }
        else {
            return Array.from(this._subdocuments.values())[this._current];
        }
    }

    get current_header() {
        if (this._subdocuments === undefined) {
            return "";
        }
        else if (Array.isArray(this._subdocuments)) {
            return this._current;
        }
        else {
            return Array.from(this._subdocuments.keys())[this._current];
        }
    }

    dispose() {

    }

    next() {
        this._current++;
        if (this._current >= this._length) {
            this._current = 0;
        }

        this._emitter.fire(this._uri);
    }

    previous() {
        this._current--;
        if (this._current < 0) {
            this._current = this._length - 1;
        }

        this._emitter.fire(this._uri);
    }

}
