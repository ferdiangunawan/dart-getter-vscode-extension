import * as vscode from "vscode";
import { activate as activateCreateGetter } from "./commands/index";

export function activate(context: vscode.ExtensionContext) {
  activateCreateGetter(context);
}

export function deactivate() {}
