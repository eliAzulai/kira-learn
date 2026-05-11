export default {
  customSyntax: 'postcss-html',
  plugins: ['./tools/stylelint-design-token-rule.mjs'],
  rules: {
    'kira/no-raw-design-values': true,
  },
};
