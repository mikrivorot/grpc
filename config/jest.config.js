
const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '..'), // Adjust rootDir to projects/grpc/typescript_example
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.ts'], // Ensure this is relative to rootDir
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: false,
};