module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['@code-shaper/eslint-config/strict'],
  rules: {
    'no-empty-function': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
  },
};
