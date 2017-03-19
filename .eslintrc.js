module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  plugins: [
    'prettier',
    'react'
  ],
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true
    }]
  }
}