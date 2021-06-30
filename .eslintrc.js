const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:react-hooks/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    "prettier/prettier": ERROR,
    "@typescript-eslint/no-implicit-any-catch": ERROR,

    // The indent rule is redundant when we are using prettier, and it
    // sometimes conflicts with prettier's recommendation.
    "indent": OFF,

    // We should consider setting this back to WARN
    "react-hooks/exhaustive-deps": OFF,

    // "variable-name": [ERROR, "ban-keywords", "check-format", "allow-leading-underscore", "allow-pascal-case"],
    // We do imports where our files are suffixed .vue and this rule would expect we import as e.g. MainVue
    "import-name": OFF,
    // TODO: fix instances instead
    "no-increment-decrement": OFF,
    // This is no longer required on refactor/mutation-names branch TODO: remove
    "function-name": OFF,
    "no-boolean-literal-compare": OFF,

    // this rule preventing us using React.memo syntax described here https://reactjs.org/docs/react-api.html#reactmemo
    "prefer-arrow-callback": OFF,

    // these rules have been disable after the migration from tslint
    // TODO: make decision about what rules we should enable
    "no-shadow": OFF,
    "consistent-return": OFF,
    "function-paren-newline": OFF,
    "implicit-arrow-linebreak": OFF,
    "arrow-parens": OFF,
    "prefer-destructuring": OFF,
    "dot-notation": OFF,
    "lines-between-class-members": OFF,
    "no-unused-vars": OFF,
    "import/extensions": OFF,
    "import/no-unresolved": OFF,
    "import/no-extraneous-dependencies": OFF,
    "import/newline-after-import": OFF,
    "import/no-dynamic-require": OFF,
    "no-use-before-define": OFF,
    "global-require": OFF,
    "arrow-body-style": OFF,
    "no-cond-assign": OFF,
    "import/prefer-default-export": OFF,
    "new-cap": OFF,
    "no-param-reassign": OFF,
    "space-before-function-paren": OFF,
    "no-plusplus": OFF,
    "class-methods-use-this": OFF,
    "no-lonely-if": OFF,
    "import/order": OFF,
    "no-console": OFF,
    "operator-linebreak": OFF,
    "max-classes-per-file": OFF,
    "no-bitwise": OFF,
    "operator-assignment": OFF,
    "no-underscore-dangle": OFF,
    "prefer-object-spread": OFF,
    "max-len": OFF,
    "func-names": OFF,
    "no-multi-assign": OFF,
    "no-useless-escape": OFF,
    "no-return-assign": OFF,
    "no-empty": OFF,
    "no-unused-expressions": OFF,
    "no-return-await": OFF,
    "getter-return": OFF,
    "object-curly-newline": OFF,
    "quote-props": OFF,
    "no-useless-computed-key": OFF,
    "prefer-template": OFF,
    "no-void": OFF,
    "camelcase": OFF,
    "no-restricted-globals": OFF,
    "no-alert": OFF,
    "default-case": OFF,
    "array-callback-return": OFF,
    "spaced-comment": OFF,
    "no-empty-function": OFF,
    "no-prototype-builtins": OFF,
    "no-else-return": OFF,
    "no-useless-constructor": OFF,
    "no-restricted-properties": OFF,
    "no-restricted-syntax": OFF,
    "no-dupe-class-members": OFF,
    "no-useless-return": OFF,
    "no-await-in-loop": OFF,
    "no-constant-condition": OFF,
    "guard-for-in": OFF,
    "no-continue": OFF,
    "no-confusing-arrow": OFF,
    "no-async-promise-executor": OFF,
    "prefer-promise-reject-errors": OFF,
    "import/first": OFF,
    "no-script-url": OFF,
    "import/no-named-default": OFF,
  },
  overrides: [
    {
      files: ['main.js'],
      rules: {
        "@typescript-eslint/no-implicit-any-catch": OFF,
      }
    }
  ]
};
