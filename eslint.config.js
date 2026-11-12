// @ts-check
import browserConfig from './eslint.browser.js';
import extensionConfig from './eslint.extension.js';

export default [
    {
        ignores: ['node_modules/**', 'extension/**', 'dashboard/**', 'graphics/**', 'shared/**', 'src/types/**']
    },
    ...extensionConfig,
    ...browserConfig
];
