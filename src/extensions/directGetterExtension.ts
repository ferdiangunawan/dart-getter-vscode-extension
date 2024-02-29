import * as path from "path";
import * as vscode from "vscode";
import {
  createGetterFile,
  snakeToCamel,
  getImportsFromYaml,
} from "../utils/index";

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

  const importTemplates = getImportsFromYaml();
  let extensionCode = '';

  if (importTemplates.length !== 0) {
    const importedFiles = importTemplates
      .map((importPath) => `import '${importPath}';`)
      .join("\n").trim();
    extensionCode = `${importedFiles}\n\nextension ${className}Getter on ${className} {
    // create getter here e.g. String get fullName => 'David Sutarman';
  }`;
  } else {
    extensionCode = `
  extension ${className}Getter on ${className} {
    // create getter here
  }`;
  }

  createGetterFile(baseName, extensionCode, true);
}
