module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'linebreak-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/prop-types': 'off',
    'no-unsafe-finally': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-shadow': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': 'off',
    'no-use-before-define': ['error', { functions: false }],
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'no-prototype-builtins': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['src', './src/renderer/src']],
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
