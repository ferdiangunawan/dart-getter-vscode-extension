import {
  getDocumentWorkspaceFolder,
  generateGetterFileTemplate,
} from "../utils/index";

export function createGetterFileTemplate() {
  const rootPath = getDocumentWorkspaceFolder();
  if (rootPath) {
    generateGetterFileTemplate(rootPath);
  } else {
    console.error("No workspace folder found.");
  }
}
