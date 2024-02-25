import * as path from "path";
import * as vscode from "vscode";
import { createGetterFile, snakeToCamel } from "../utils/index";

export async function createDirectGetter() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active editor found.");
    return;
  }


  const document = editor.document;
  const fileName = path.basename(document.fileName);
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);
  const className = snakeToCamel(
    baseName.charAt(0).toUpperCase() + baseName.slice(1),
    true
  );

  const extensionCode = `

extension ${className}Extension on ${className} {
  // create getter here
}
`;

  createGetterFile(baseName, extensionCode, true);
}
