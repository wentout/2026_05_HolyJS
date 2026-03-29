const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');

const commonRules = {
	'indent': ['error', 'tab'],
	'key-spacing': ['warn', {
		beforeColon: true,
		afterColon: true,
		align: 'colon',
	}],
	'linebreak-style': ['error', 'unix'],
	'quotes': ['error', 'single'],
	'semi': ['error', 'always'],
	'no-unused-vars': 'off',
	'@typescript-eslint/no-unused-vars': 'error',
	'no-shadow': ['error', {
		builtinGlobals: true,
		hoist: 'all',
		allow: ['this'],
	}],
	'array-bracket-spacing': ['error', 'always'],
	'computed-property-spacing': ['error', 'always'],
	'object-curly-spacing': ['error', 'always'],
	'space-before-function-paren': ['error', {
		'anonymous': 'always',
		'named': 'always',
		'asyncArrow': 'always',
	}],
	'prefer-template': 'warn',
	'prefer-spread': 'warn',
	'no-useless-concat': 'warn',
	'prefer-rest-params': 'warn',
	'prefer-destructuring': 'warn',
	'no-useless-computed-key': 'warn',
	'no-useless-constructor': 'warn',
	'no-useless-rename': 'warn',
	'no-this-before-super': 'warn',
	'no-new-symbol': 'warn',
	'no-duplicate-imports': 'warn',
	'no-confusing-arrow': 'warn',
	'no-multi-assign': 'warn',
	'no-lonely-if': 'warn',
	'newline-per-chained-call': 'warn',
	'func-name-matching': 'error',
	'line-comment-position': ['warn', {
		position: 'above',
	}],
	'@typescript-eslint/no-var-requires': 'off',
	'@typescript-eslint/no-empty-function': 'off',
	'@typescript-eslint/no-explicit-any': 'off',
	'@typescript-eslint/no-require-imports': 'off',
	'@typescript-eslint/no-this-alias': 'off',
	'@typescript-eslint/ban-ts-comment': 'warn',
	'new-cap': 'off',
	'yoda': 'warn',
};

const commonLanguageOptions = {
	parser: tsParser,
	globals: {
		...globals.node,
	},
	ecmaVersion: 2018,
	sourceType: 'module',
};

const commonPlugins = {
	'@typescript-eslint': typescriptEslint,
};

module.exports = [
	// Ignore patterns
	{
		ignores: [
			'.tactica/**',
			'public/examples/**',
			'node_modules/**',
			'dist/**',
			'build/**',
			'../docs/**'
		]
	},
	// Config for src directory
	{
		files: ['src/**/*.{js,ts,tsx}'],
		languageOptions: commonLanguageOptions,
		plugins: commonPlugins,
		rules: commonRules,
	}
];
