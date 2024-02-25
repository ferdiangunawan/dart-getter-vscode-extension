import * as vscode from "vscode";
import { createDirectGetter, createGroupedGetter } from "../extensions/index";

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createGetter",
    async () => {
      const option = await vscode.window.showQuickPick(
        ["Direct Getter", "Grouped Getter"],
        { placeHolder: "Choose getter type" }
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

  context.subscriptions.push(disposable);
}
