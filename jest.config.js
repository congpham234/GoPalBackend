module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.ts'],
  testRegex: '/tst/.*\\.(test|spec)?\\.(ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  collectCoverageFrom: [
    '!**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/app.ts',
    '!**/src/mocks/**',
    '!**/src/models/**',
    '!**/routes/router.ts',
    '!**/middlewares/**',
    '!**/exceptions/**',
    '!**/routes/**',
    '!**/constants/**',
  ],
  coverageReporters: ['clover', 'json', 'lcov', ['text', {skipFull: true}]],
  // coverageThreshold: {
  //   global: {
  //     functions: 90,
  //     lines: 90,
  //   },
  // },
  testTimeout: 10000,
};
