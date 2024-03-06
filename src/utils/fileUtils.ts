import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as yaml from "js-yaml";

export function createGetterFile(baseName: string, extensionCode: string) {
  const folderPath = getGetterFolderPath();
  const newFileName = `${baseName}_getter.dart`;

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
 * Get data from a YAML file located in the specified path.
 * @param filePath The path to the YAML file.
 * @param section The section to extract from the YAML file.
 * @returns The data parsed from the YAML file, or undefined if the file is not found or invalid.
 */
export function getDataFromYaml(section: "import" | "ignore"): string[] {
  // Get the root project path
  const rootPath = getDocumentWorkspaceFolder();
  if (!rootPath) {
    vscode.window.showWarningMessage("Project root path not found.");
    return [];
  }

  // Construct the path to the YAML file
  const filePath = path.join(rootPath, "getter_file_template.yaml");

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    vscode.window.showWarningMessage(`${path.basename(filePath)} not found.`);
    return [];
  }

  // Read the YAML file
  const yamlContent = fs.readFileSync(filePath, "utf8");

  try {
    // Parse the YAML content
    const yamlData = yaml.load(yamlContent) as
      | { [key: string]: string[] }
      | undefined;

    if (yamlData && Array.isArray(yamlData[section])) {
      // Extract the list of items from the specified section
      return yamlData[section].map((item: string) => item);
    } else {
      vscode.window.showWarningMessage(
        `Invalid format: ${section} section is missing or not an array.`
      );
      return [];
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error parsing ${path.basename(filePath)}: ${(error as Error).message}`
    );
    return [];
  }
}

export function generateGetterFileTemplate(rootPath: string): void {
  const content = `import:
    # - package:component/index.dart`;

  const filePath = vscode.Uri.joinPath(
    vscode.Uri.file(rootPath),
    "getter_file_template.yaml"
  ).fsPath;

  fs.writeFileSync(filePath, content);
}
