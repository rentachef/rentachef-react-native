module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:react/recommended",
    "plugin:react-native/all",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    project: './tsconfig.json',
    sourceType: "module" // Allows for the use of imports
  },
  plugins: [
    "react",
    "react-hooks",
    "react-native"
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/ban-ts-ignore": "warn",
    "react-native/no-inline-styles": "off",
    "react-native/no-color-literals": "off",
    "react-native/sort-styles": "off",
    "camelcase": "off",
    "@typescript-eslint/camelcase": "error",
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/consistent-type-assertions": ["error", {"assertionStyle": "as", "objectLiteralTypeAssertions": "allow"}],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "func-call-spacing": "off",
    "@typescript-eslint/func-call-spacing": ["error", "never"],
    "@typescript-eslint/indent": ["error", 2, {
      "ArrayExpression": "first",
      "CallExpression": {"arguments": "first"},
      "FunctionDeclaration": {"parameters": "first"},
      "FunctionExpression": {"parameters": "first"},
      "ImportDeclaration": "first",
      "ObjectExpression": "first",
      "SwitchCase": 1,
      "VariableDeclarator": "first"
    }],
    "@typescript-eslint/interface-name-prefix": ["error", {"prefixWithI": "never"}], // don't prefix interface names with an I
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "semi",
        "requireLast": true
      },
      "singleline": {
        "delimiter": "semi",
        "requireLast": false
      }
    }],
    "@typescript-eslint/member-naming": ["error", {"private": "^_"}], // start off private fields with an underscore
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["error", {"allow": ["arrowFunctions"]}],
    "@typescript-eslint/no-empty-interface": [
      "error",
      {
        "allowSingleExtends": false
      }
    ],
    "@typescript-eslint/no-explicit-any": ["warn", { "ignoreRestArgs": true }],
    "@typescript-eslint/no-floating-promises": ["error", { "ignoreVoid": true }], // always handle promise results (then and catch)
    "@typescript-eslint/no-misused-new": "error",
    "no-magic-numbers": "off",
    "@typescript-eslint/no-magic-numbers": ["warn", { "ignoreEnums": true, "ignoreNumericLiteralTypes": true }],
    "@typescript-eslint/no-inferrable-types": ["error", {"ignoreParameters": true, "ignoreProperties": true}],
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-require-imports": "warn",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/prefer-regexp-exec": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "quotes": "off",
    "@typescript-eslint/quotes": ["error", "single", {"avoidEscape": true, "allowTemplateLiterals": true}],
    "@typescript-eslint/require-array-sort-compare": "error",
    "require-await": "off",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/restrict-plus-operands": "error", // have both operands be number or string
    "@typescript-eslint/strict-boolean-expressions": ["warn", {"allowNullable": true, "ignoreRhs": true}],
    "@typescript-eslint/triple-slash-reference": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/unified-signatures": "warn",
    "react-hooks/rules-of-hooks": 'error',
    "react-hooks/exhaustive-deps": 'warn'

  },
  settings: {
    "react": {
      "version": "detect"
    }
  }
};
