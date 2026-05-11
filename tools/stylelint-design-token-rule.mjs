import stylelint from 'stylelint';

const ruleName = 'kira/no-raw-design-values';

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value) => `Use a design token instead of raw design value "${value}".`,
});

const RAW_VALUE_PATTERN = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(|(?:^|[\s,(])-?\d*\.?\d+px\b/i;

const plugin = stylelint.createPlugin(ruleName, (enabled) => {
  return (root, result) => {
    if (!enabled) return;

    root.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) return;

      const match = decl.value.match(RAW_VALUE_PATTERN);
      if (!match) return;

      stylelint.utils.report({
        message: messages.rejected(match[0].trim()),
        node: decl,
        result,
        ruleName,
      });
    });
  };
});

plugin.ruleName = ruleName;
plugin.messages = messages;

export default plugin;
