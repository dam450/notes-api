/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // Stop running tests after `n` failures
  bail: 1,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // The root directory that Jest should scan for tests and modules within
  rootDir: 'src',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
}
