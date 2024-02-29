import * as path from "path";
import * as vscode from "vscode";
import {
  capitalizeFirstLetter,
  lowercaseFirstLetter,
} from "../utils/stringUtils";
import {
  createGetterFile,
  getImportsFromYaml,
  snakeToCamel,
} from "../utils/index";

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
    placeHolder: "write your grouped getter here ex: skill",
    value: "",
  });

  if (!exampleGetterName) {
    return;
  }

  const cleanedGetterName = exampleGetterName.replace(/[^a-zA-Z]/g, "");

  const exampleGetterNameCapitalize = capitalizeFirstLetter(cleanedGetterName);
  const exampleGetterNameLower = lowercaseFirstLetter(cleanedGetterName);
  const getterClassName = `_${exampleGetterNameCapitalize}Getter`;
  const getterGroupName = `${exampleGetterNameLower}Getter`;
  const importTemplates = getImportsFromYaml();
  var generatedCode = "";

  if (importTemplates.length !== 0) {
    const importedFiles = importTemplates
      .map((importPath) => `import '${importPath}';`)
      .join('\n').trim();

    generatedCode = `${importedFiles}\n\n// e.g. model.${getterGroupName}.getterName
extension ${className}NamedGetter on ${className} {
  // Add more getters here
  ${getterClassName} get ${getterGroupName} => ${getterClassName}(this);
}

class ${getterClassName} {
  final ${className} data;

  ${getterClassName}(this.data);
  // write your getters here
}
`;
  } else {
    generatedCode = `
  // How to call: yourObject.${getterGroupName}.yourGetter
  extension ${className}NamedGetter on ${className} {
    // Add more group of getters here
    ${getterClassName} get ${getterGroupName} => ${getterClassName}(this);
  }
  
  class ${getterClassName} {
    final ${className} data;
  
    ${getterClassName}(this.data);
    // write your getters here
  }
  `;
  }

  createGetterFile(baseName, generatedCode, false);
}
