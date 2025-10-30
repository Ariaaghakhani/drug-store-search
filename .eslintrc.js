const prettierConfig = require('./.prettierrc.js')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [
    '@nuxtjs',
    'plugin:@intlify/vue-i18n/recommended',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'no-console': 'off',
    'vue/require-prop-types': 0,
    'vue/require-default-prop': 0,
    'vue/no-mutating-props': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-reserved-component-names': 0,
    'prettier/prettier': ['error', prettierConfig],
    '@intlify/vue-i18n/no-dynamic-keys': 'error',
    '@intlify/vue-i18n/no-unused-keys': 'error',
    '@intlify/vue-i18n/no-missing-keys': 'error',
    '@intlify/vue-i18n/no-missing-keys-in-other-locales': 'error',
    '@intlify/vue-i18n/no-raw-text': 0,
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
      },
    ],
    'vue/require-explicit-emits': 'error',
  },
  settings: {
    'vue-i18n': {
      localeDir: {
        pattern: './i18n/*.json',
        localeKey: 'file',
      },
    },
  },
}
