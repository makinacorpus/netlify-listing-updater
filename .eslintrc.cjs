const error  = 'error';
const warn   = 'warn';
const off    = 'off';
const always = 'always';

module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: [
    'airbnb-base',
  ],
  env: {
    browser: true,
  },
  rules: {
    'arrow-parens': [error, 'as-needed'],
    camelcase: [warn],
    'no-param-reassign': [warn],
    'object-curly-newline': [warn, { consistent: true }],
    'implicit-arrow-linebreak': [off],
    'prefer-template': [warn],
    'space-before-function-paren': [error, always],

    'import/extensions': [warn],
    'import/no-extraneous-dependencies': [warn, { devDependencies: ['**/*.test.js', '**/*.spec.js', '**/*.stories.js'] }],
    'import/no-named-as-default': [off],
    'import/no-unresolved': [warn],

    'key-spacing': [error, {
      singleLine: { mode: 'strict' },
      multiLine:  { mode: 'minimum' },
    }],

    'no-multi-spaces': [warn, {
      exceptions: {
        Property: true,
        VariableDeclarator: true,
        ImportDeclaration: true,
        BinaryExpression: true,
      },
    }],

    'no-unused-expressions': [warn, {
      allowShortCircuit: true,
      allowTernary: true,
      allowTaggedTemplates: true,
    }],
  },
};
