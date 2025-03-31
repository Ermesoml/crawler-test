/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['**/*.spec.js'],
  verbose: true,
  clearMocks: true,
};

module.exports = config;
