import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  {
    ignores: [
      'config/jest.config.js',
      'node_modules/',
      'client_old/',
      'dist/',
      'grpc/build/',
      'grpc/proto/',
      'eslint.config.mjs'
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        // eslint-disable-next-line no-undef
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      "@typescript-eslint/no-empty-object-type": "off",
      "no-case-declarations": "off",
    },
  },
];
