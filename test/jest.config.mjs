import createConfigFactory from 'next/jest.js';

/** @typedef {import('@jest/types').Config.InitialOptions} JestConfig */

/** @type {JestConfig} */
const config = {
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/*.@(ts|tsx)', '!**/*.d.ts', '!**/node_modules/**'],
  rootDir: '../',
  moduleNameMapper: {
    '^.+\\.module\\.css$': 'next/dist/build/jest/object-proxy.js',
    '^.+\\.css$': 'next/dist/build/jest/__mocks__/styleMock.js',
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': `next/dist/build/jest/__mocks__/fileMock.js`,
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
    /** @see https://github.com/facebook/jest/issues/12036 */
    '^d3-(.*)$': `d3-$1/dist/d3-$1`,
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};

const createConfig = createConfigFactory({ dir: process.cwd() });

export default createConfig(config);
