// @ts-check
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint'; // Import this
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import eslintPluginPrettierRecommended from 'eslint-config-prettier';
import vueParser from 'vue-eslint-parser';
import * as tsParser from '@typescript-eslint/parser';

export default tseslint.config(
    ...pluginVue.configs['flat/recommended'],
    ...defineConfigWithVueTs(vueTsConfigs.recommended),
    eslintPluginPrettierRecommended,
    {
        files: ['src/browser_shared/**/*.{ts,vue}', 'src/dashboard/**/*.{ts,vue}', 'src/graphics/**/*.{ts,vue}'],
        rules: {
            'vue/multi-word-component-names': ['error', { ignores: ['main'] }],
            'vue/html-indent': ['error', 4, { baseIndent: 1 }],
            'vue/html-self-closing': [
                'error',
                {
                    html: { void: 'always', normal: 'never', component: 'always' },
                    svg: 'always',
                    math: 'always'
                }
            ]
        }
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: ['.vue'],
                sourceType: 'module',
                ecmaVersion: 'latest'
            }
        }
    }
);