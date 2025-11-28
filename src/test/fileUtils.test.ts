import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { generateGetterFileTemplate } from '../utils/fileUtils';

suite('File Utils Test Suite', () => {
	const testDir = path.join(__dirname, 'test-workspace');

	setup(() => {
		// Create test directory if it doesn't exist
		if (!fs.existsSync(testDir)) {
			fs.mkdirSync(testDir, { recursive: true });
		}
	});

	teardown(() => {
		// Clean up test files
		const templatePath = path.join(testDir, 'getter_file_template.yaml');
		if (fs.existsSync(templatePath)) {
			fs.unlinkSync(templatePath);
		}
		if (fs.existsSync(testDir)) {
			fs.rmdirSync(testDir);
		}
	});

	suite('generateGetterFileTemplate', () => {
		test('should create getter_file_template.yaml in the specified path', () => {
			generateGetterFileTemplate(testDir);

			const templatePath = path.join(testDir, 'getter_file_template.yaml');
			assert.strictEqual(fs.existsSync(templatePath), true);
		});

		test('should create file with correct content structure', () => {
			generateGetterFileTemplate(testDir);

			const templatePath = path.join(testDir, 'getter_file_template.yaml');
			const content = fs.readFileSync(templatePath, 'utf8');

			// Check that the content contains the import section
			assert.strictEqual(content.includes('import:'), true);
			// Check that it includes the commented example
			assert.strictEqual(content.includes('# - package:component/index.dart'), true);
		});

		test('should overwrite existing file', () => {
			const templatePath = path.join(testDir, 'getter_file_template.yaml');

			// Create an existing file with different content
			fs.writeFileSync(templatePath, 'old content');

			// Generate the template
			generateGetterFileTemplate(testDir);

			// Read the file and check it was overwritten
			const content = fs.readFileSync(templatePath, 'utf8');
			assert.strictEqual(content.includes('import:'), true);
			assert.strictEqual(content.includes('old content'), false);
		});
	});
});
