import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Keep the existing component names
      'vue/multi-word-component-names': 'off',
      // Doesn't see variables from `<script setup>` that are used in the template
      'no-useless-assignment': 'off',
    },
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.vitest },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
)
