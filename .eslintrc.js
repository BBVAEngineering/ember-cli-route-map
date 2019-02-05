'use strict';

module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	plugins: [
		'ember'
	],
	extends: [
		'plugin:ember/recommended',
		'eslint-config-bbva'
	],
	env: {
		browser: true
	},
	overrides: [{
		files: [
			'.huskyrc.js',
			'.commitlintrc.js',
			'.eslintrc.js',
			'.template-lintrc.js',
			'ember-cli-build.js',
			'index.js',
			'testem.js',
			'blueprints/*/index.js',
			'config/**/*.js',
			'tests/dummy/config/**/*.js',
			'lib/**/*.js'
		],
		excludedFiles: [
			'addon/**',
			'addon-test-support/**',
			'app/**',
			'tests/dummy/app/**'
		],
		parserOptions: {
			sourceType: 'script',
			ecmaVersion: 2015
		},
		env: {
			browser: false,
			node: true
		},
		plugins: ['node'],
		rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
			'no-process-env': 0
		})
	}, {
		files: [
			'node-tests/**/*.js'
		],
		env: {
			browser: false,
			mocha: true,
			node: true
		},
		plugins: ['mocha'],
		rules: {
			'no-process-env': 0,
			'no-unused-expressions': 0,
			'mocha/no-exclusive-tests': 'error'
		}
	}]
};
