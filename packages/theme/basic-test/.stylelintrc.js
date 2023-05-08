module.exports = {
  extends: 'stylelint-config-standard-scss',
  rules: {
    'selector-class-pattern': '^[a-z-_]+$',
    'at-rule-no-unknown': null,
    'no-descending-specificity': null,
    'max-nesting-depth': 2
  }
}
