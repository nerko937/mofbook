import { defineConfig, globalIgnores } from 'eslint/config'
import expoConfig from 'eslint-config-expo/flat.js'
import stylistic from '@stylistic/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'

export default defineConfig([
  globalIgnores(['dist/*', '.expo/*', 'node_modules/*']),
  expoConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@stylistic': stylistic,
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      'react/jsx-tag-spacing': [
        'error',
        { beforeSelfClosing: 'always', beforeClosing: 'allow' },
      ],
      'react/jsx-curly-spacing': ['error', { when: 'always', children: true }],
      'react/jsx-pascal-case': 'error',
      'react/jsx-props-no-multi-spaces': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])
