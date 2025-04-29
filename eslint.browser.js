// @ts-check
import {defineConfigWithVueTs, vueTsConfigs} from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

/* Rules used for anything browser related (dashboard and graphics). */
export default ({
    languageOptions: {
        parser: 'vue-eslint-parser'
    },
    plugins: {
        vue: pluginVue,
    },
    extends: defineConfigWithVueTs(
        pluginVue.configs['flat/recommended'],
        vueTsConfigs.recommended,
    ),
    rules: {
        // Allows "main.vue" files to be named as such.
        'vue/multi-word-component-names': ['error', {ignores: ['main']}],
    },
    files: [
        'src/browser_shared/**/*.ts',
        'src/browser_shared/**/*.vue',
        'src/dashboard/**/*.ts',
        'src/dashboard/**/*.vue',
        'src/graphics/**/*.ts',
        'src/graphics/**/*.vue',
    ],
});
