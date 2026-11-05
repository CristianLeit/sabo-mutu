module.exports = {
  root: true,
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  rules: {
    // TypeScript handles undefined-name checks, and React is provided by the JSX runtime.
    'no-undef': 'off',
  },
  ignorePatterns: ['**/node_modules/**', '**/dist/**', 'apps/web/.next/**'],
};
