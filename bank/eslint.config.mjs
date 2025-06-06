import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: {
    globals: globals.browser,
    sourceType: "module",
    }
  },
  {
    plugins: {
      prettier: prettier,
    },
  },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    ignores: ['node_modules/', 'webpack.config.js', 'cypress.config.js'],
  },
  {
    files: ['src/js/**/*.js', 'cypress/e2e/**/*.js'],
    rules: {
      'no-var': 'error',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
];
