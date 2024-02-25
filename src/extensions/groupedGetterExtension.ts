import * as path from "path";
import * as vscode from "vscode";
import {
  capitalizeFirstLetter,
  lowercaseFirstLetter,
} from "../utils/stringUtils";
import { createGetterFile } from "../utils/fileUtils";
import { snakeToCamel } from "../utils/stringUtils";

export async function createGroupedGetter() {
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

  const exampleGetterName = await vscode.window.showInputBox({
    prompt: "Enter the name of grouped getter:",
    placeHolder: "write your grouped getter here ex: attendance",
    value: "",
  });

  if (!exampleGetterName) {
    return;
  }

  const cleanedGetterName = exampleGetterName.replace(/[^a-zA-Z]/g, '');

  const exampleGetterNameCapitalize = capitalizeFirstLetter(cleanedGetterName);
  const exampleGetterNameLower = lowercaseFirstLetter(cleanedGetterName);
  const getterClassName = `_${exampleGetterNameCapitalize}Getter`;
  const getterGroupName = `${exampleGetterNameLower}Getter`;

  const extensionCode = `

// e.g. model.${getterGroupName}.getterName
extension ${className}NamedGetter on ${className} {
  // change ${exampleGetterName} getter to yours
  ${getterClassName} get ${getterGroupName} => ${getterClassName}(this);
}

class ${getterClassName} {
  final ${className} data;

  ${getterClassName}(this.data);
  // write your getters here
}
`;

  createGetterFile(baseName, extensionCode, false);
}
