import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default createConfigForNuxt().append(
	...pluginVueA11y.configs['flat/recommended'],
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-unused-expressions': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'vue/html-indent': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/multi-word-component-names': 'off',
			'vue/html-self-closing': 'off',
		},
	},
);
