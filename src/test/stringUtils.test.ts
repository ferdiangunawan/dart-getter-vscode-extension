import * as assert from 'assert';
import { capitalizeFirstLetter, lowercaseFirstLetter, snakeToCamel } from '../utils/stringUtils';

suite('String Utils Test Suite', () => {
	suite('capitalizeFirstLetter', () => {
		test('should capitalize first letter of a lowercase string', () => {
			assert.strictEqual(capitalizeFirstLetter('hello'), 'Hello');
		});

		test('should keep already capitalized string unchanged', () => {
			assert.strictEqual(capitalizeFirstLetter('Hello'), 'Hello');
		});

		test('should handle single character string', () => {
			assert.strictEqual(capitalizeFirstLetter('a'), 'A');
		});

		test('should handle empty string', () => {
			assert.strictEqual(capitalizeFirstLetter(''), '');
		});

		test('should capitalize first letter and keep rest unchanged', () => {
			assert.strictEqual(capitalizeFirstLetter('hELLO'), 'HELLO');
		});

		test('should handle string with numbers', () => {
			assert.strictEqual(capitalizeFirstLetter('123abc'), '123abc');
		});
	});

	suite('lowercaseFirstLetter', () => {
		test('should lowercase first letter of an uppercase string', () => {
			assert.strictEqual(lowercaseFirstLetter('Hello'), 'hello');
		});

		test('should keep already lowercase string unchanged', () => {
			assert.strictEqual(lowercaseFirstLetter('hello'), 'hello');
		});

		test('should handle single character string', () => {
			assert.strictEqual(lowercaseFirstLetter('A'), 'a');
		});

		test('should handle empty string', () => {
			assert.strictEqual(lowercaseFirstLetter(''), '');
		});

		test('should lowercase first letter and keep rest unchanged', () => {
			assert.strictEqual(lowercaseFirstLetter('HELLO'), 'hELLO');
		});
	});

	suite('snakeToCamel', () => {
		test('should remove underscores when isFirstCapital is false', () => {
			// Current behavior: without isFirstCapital, only removes underscores
			assert.strictEqual(snakeToCamel('hello_world'), 'helloworld');
		});

		test('should handle string without underscores', () => {
			assert.strictEqual(snakeToCamel('hello'), 'hello');
		});

		test('should handle multiple underscores without isFirstCapital', () => {
			assert.strictEqual(snakeToCamel('hello_world_test'), 'helloworldtest');
		});

		test('should handle empty string', () => {
			assert.strictEqual(snakeToCamel(''), '');
		});

		test('should convert to PascalCase when isFirstCapital is true', () => {
			assert.strictEqual(snakeToCamel('hello_world', true), 'HelloWorld');
		});

		test('should capitalize single word with isFirstCapital', () => {
			assert.strictEqual(snakeToCamel('hello', true), 'Hello');
		});

		test('should handle multiple underscores with isFirstCapital', () => {
			assert.strictEqual(snakeToCamel('hello_world_test', true), 'HelloWorldTest');
		});

		test('should handle consecutive underscores', () => {
			// _a where a is lowercase gets replaced
			assert.strictEqual(snakeToCamel('hello__world'), 'hello_world');
		});

		test('should handle trailing underscore', () => {
			assert.strictEqual(snakeToCamel('hello_'), 'hello_');
		});

		test('should handle leading underscore with lowercase letter following', () => {
			// _h gets replaced
			assert.strictEqual(snakeToCamel('_hello'), 'hello');
		});

		test('should convert to proper class name format when used as intended', () => {
			// This tests the actual usage pattern in the extension
			const baseName = 'user_profile';
			const className = snakeToCamel(
				baseName.charAt(0).toUpperCase() + baseName.slice(1),
				true
			);
			assert.strictEqual(className, 'UserProfile');
		});
	});
});
