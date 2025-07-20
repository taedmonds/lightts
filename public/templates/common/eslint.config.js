// eslint.config.js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    // Base JavaScript rules
    js.configs.recommended,

    // TypeScript rules
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json'
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off'
        }
    },

    // Prettier compatibility (optional)
    {
        rules: {
            'prettier/prettier': 'warn'
        },
        plugins: {
            prettier: require('eslint-plugin-prettier')
        }
    }
];
