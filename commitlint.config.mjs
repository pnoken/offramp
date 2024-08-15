/* global module */
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'references-empty': [2, 'never'],
        'footer-max-line-length': [0, 'always'],
        'body-max-line-length': [0, 'always'],
    },
    parserPreset: {
        parserOpts: {
            issuePrefixes: ['ACT-'],
        },
    },
};
