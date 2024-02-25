import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function createGetterFile(baseName: string, extensionCode: string, isDirectGetter: Boolean) {
  const folderPath = getGetterFolderPath();
  const newFileName =    
  isDirectGetter
      ? `${baseName}_direct_getter.dart`
      : `${baseName}_grouped_getter.dart`;
  
  const filePath = path.join(folderPath, newFileName);

  try {
    fs.writeFileSync(filePath, extensionCode);
    vscode.window.showInformationMessage(
      `Extension created successfully at: ${filePath}`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error creating extension: ${String(error)}`
    );
  }
}

function getGetterFolderPath(): string {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    throw new Error("No active editor found.");
  }

  const document = editor.document;
  const folderPath = path.join(path.dirname(document.fileName), "getter");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  return folderPath;
}
