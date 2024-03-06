import * as path from "path";
import * as vscode from "vscode";
import {
  capitalizeFirstLetter,
  lowercaseFirstLetter,
} from "../utils/stringUtils";
import {
  createGetterFile,
  getDataFromYaml,
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
  const ignoreTemplates = getDataFromYaml("ignore");
  const importTemplates = getDataFromYaml("import");
  var generatedCode = "";

  if (importTemplates.length !== 0 || ignoreTemplates.length !== 0) {
    const ignoredCodes = ignoreTemplates
      .map((ignoreCode) => `// ignore_for_file:${ignoreCode}`)
      .join("\n")
      .trim();

    const importedFiles = importTemplates
      .map((importPath) => `import '${importPath}';`)
      .join("\n")
      .trim();

    generatedCode = `${ignoredCodes}\n\n${importedFiles}\n
extension ${className}NamedGetter on ${className} {
  // How to call: yourObject.${getterGroupName}.yourGetter
  // Add more getter groups here
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
  extension ${className}NamedGetter on ${className} {
    // How to call: yourObject.${getterGroupName}.yourGetter
    // Add more getter groups here
    ${getterClassName} get ${getterGroupName} => ${getterClassName}(this);
  }
  
  class ${getterClassName} {
    final ${className} data;
  
    ${getterClassName}(this.data);
    // write your getters here
  }
  `;
  }

  createGetterFile(baseName, generatedCode);
}
