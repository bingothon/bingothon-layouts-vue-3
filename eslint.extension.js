// @ts-check
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-config-prettier';

/* Rules used for the server-side extension code. */
export default tseslint.config(pluginJs.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended, {
    files: ['src/extension/**/*.ts'],
    rules: {}
});