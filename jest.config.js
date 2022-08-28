/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { join } = require('path');
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
 rootDir: __dirname,
 coverageProvider: "v8",
 coverageThreshold: {
   global: {
    lines: 40
   }
 },

 bail: true,
 clearMocks: true,
 displayName: 'unit-tests',

 preset: 'ts-jest',
 testEnvironment: 'node',

 modulePaths: ["node_modules" , "src"],
 moduleDirectories: ["node_modules", "src"],

 moduleNameMapper: {
  "utils" : "functions" , 
  "/^(.*)$/": [
    "node_modules/$1",
    "types/$1"
  ]
 },
transformIgnorePatterns: [
  '//node_modules',
],
transform: {
  // '\\.[jt]s?$': 'esbuild-jest',
  // "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest"
}
};
