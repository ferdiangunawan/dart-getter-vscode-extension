import * as vscode from "vscode";
import {
  createGroupedGetter,
  createGetterFileTemplate,
} from "../extensions/index";

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createGetterFile",
    async () => {
      await createGroupedGetter();
    }
  );

  let disposableInitTemplate = vscode.commands.registerCommand(
    "extension.initGetterTemplate",
    () => {
      createGetterFileTemplate();
      vscode.window.showInformationMessage("Getter file template initialized.");
    }
  );

  context.subscriptions.push(disposable, disposableInitTemplate);
}
