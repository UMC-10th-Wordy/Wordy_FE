export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'style', 'refactor', 'chore', 'docs', 'test', 'revert'],
    ],
    'subject-max-length': [2, 'always', 72],
    'subject-empty': [2, 'never'],
  },
}
