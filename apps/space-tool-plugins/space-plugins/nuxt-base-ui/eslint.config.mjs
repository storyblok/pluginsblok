import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default createConfigForNuxt(
	{},
	...pluginVueA11y.configs['flat/recommended'],
	{
		rules: {
			'vue/html-indent': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/multi-word-component-names': 'off',
			'vue/html-self-closing': 'off',
		},
	},
);
