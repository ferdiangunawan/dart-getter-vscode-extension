import * as vscode from "vscode";
import {
  createDirectGetter,
  createGroupedGetter,
  createGetterFileTemplate,
} from "../extensions/index";

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createGetterFile",
    async () => {
      const option = await vscode.window.showQuickPick(
        ["Direct Getter", "Grouped Getter"],
        { placeHolder: "Select getter type" }
      );

      if (option) {
        if (option === "Direct Getter") {
          await createDirectGetter();
        } else {
          await createGroupedGetter();
        }
      }
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
