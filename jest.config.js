module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/tst/.*\\.(test|spec)?\\.(ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  collectCoverageFrom: [
    '!**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/app.ts',
    '!**/src/mocks/**',
    '!**/src/models/**',
    '!**/routes/router.ts',
    '!**/apis/**',
    '!**/generated/**',
    '!**/middlewares/**',
  ],
  coverageReporters: ['clover', 'json', 'lcov', ['text', {skipFull: true}]],
  coverageThreshold: {
    global: {
      functions: 90,
      lines: 90,
      statements: -10,
    },
  },
  testTimeout: 10000,
};
