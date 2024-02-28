import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as yaml from "js-yaml";

export function createGetterFile(
  baseName: string,
  extensionCode: string,
  isDirectGetter: Boolean
) {
  const folderPath = getGetterFolderPath();
  const newFileName = isDirectGetter
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

export function getDocumentWorkspaceFolder(): string | undefined {
  const fileName = vscode.window.activeTextEditor?.document.fileName;
  return vscode.workspace.workspaceFolders
    ?.map((folder) => folder.uri.fsPath)
    .filter((fsPath) => fileName?.startsWith(fsPath))[0];
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

/**
 * Get the list of import defined in the getter_file_template.yaml file
 * located in the project root directory.
 * @returns An array of import statements, or an empty array if the file is not found or invalid.
 */
export function getImportsFromYaml(): string[] {
  // Get the root project path
  const rootPath = getDocumentWorkspaceFolder();
  if (!rootPath) {
    vscode.window.showWarningMessage("Project root path not found.");
    return [];
  }

  // Construct the path to the YAML file
  const yamlFilePath = path.join(rootPath, "getter_file_template.yaml");

  // Check if the file exists
  if (!fs.existsSync(yamlFilePath)) {
    vscode.window.showWarningMessage("import_getter_file_template.yaml not found.");
    return [];
  }

  // Read the YAML file
  // const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
  const yamlContent = fs.readFileSync(yamlFilePath, "utf8");

  try {
    // Parse the YAML content
    const yamlData = yaml.load(yamlContent) as { import: string[] };

    if (Array.isArray(yamlData?.import)) {
      // Extract the list of import
      return yamlData.import.map((importPath: string) => `${importPath}`);
    } else {
      vscode.window.showWarningMessage(
        "Invalid format: import property is missing or not an array."
      );
      return [];
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error parsing getter_file_template.yaml: ${(error as Error).message}`
    );
    return [];
  }
}

export function generateGetterFileTemplate(rootPath: string): void {
  const content = `import:
    # - package:component/index.dart`;

  const filePath = vscode.Uri.joinPath(vscode.Uri.file(rootPath), 'getter_file_template.yaml').fsPath;

  fs.writeFileSync(filePath, content);
}
