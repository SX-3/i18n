const DEFAULT_ORDER: Intl.LDMLPluralRule[] = ['other', 'one', 'few', 'two', 'many', 'zero'];

type Variants = Record<Intl.LDMLPluralRule, string | ((count: number) => string)>;

export function pluralize(
  variants: Partial<Variants>,
  rules: Intl.PluralRules,
  order = DEFAULT_ORDER,
) {
  return (count: number) => {
    const rule = rules.select(count);

    let message = variants[rule];

    // ? try all variants
    if (!message) {
      for (const variant of order) {
        if (variant in variants) {
          message = variants[variant];
          break;
        }
      }
    }

    if (!message) return '<INVALID>';
    if (typeof message === 'function') return message(count);
    return message;
  };
}
