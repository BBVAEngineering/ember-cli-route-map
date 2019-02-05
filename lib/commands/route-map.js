'use strict';

const path = require('path');
const flat = require('flat');
const fs = require('fs');
const lodash = require('lodash');
const walkSync = require('walk-sync');
const mkdirp = require('mkdirp');
const BuildCommand = require('ember-cli/lib/commands/build');
const parseRouter = require('../utils/parse-router.js');

function resolveDir(dir) {
	return path.resolve(process.cwd(), dir);
}

function parseAppRoutes(globs = ['addons/*/reopens/router.js', 'app/router.js']) {
	const files = walkSync('.', { globs });
	const routes = files.map((file) => {
		file = resolveDir(file);

		return parseRouter(file);
	}).reduce((acc, route) => [...acc, ...route], []);

	return {
		name: 'app',
		children: routes
	};
}

function parseEngineRoutes(globs) {
	const files = walkSync('.', { globs });
	const engines = files.map((file) => {
		const [, engine] = file.match(/lib\/(.+)\/addon/);

		file = resolveDir(file);

		return {
			name: engine,
			children: parseRouter(file)
		};
	});

	return {
		name: 'engines',
		children: engines
	};
}

const DEFAULT_APP_ROUTER = 'app/router.js';
const DEFAULT_ENGINES_ROUTER = 'lib/*/addon/routes.js';

module.exports = BuildCommand.extend({
	name: 'route-map',

	description: 'Create an interactive map based in the existing routes in your Ember application.',

	availableOptions: [
		{
			name: 'output',
			type: String,
			aliases: ['o'],
			description: 'The directory where reports will be writen.'
		}, {
			name: 'pretty',
			type: Boolean,
			aliases: ['p'],
			description: 'Make an HTML report.'
		}, {
			name: 'globs',
			type: Array,
			aliases: ['g'],
			description: 'Globs that contains route files (ex. `--globs "lib/*/addon/routes.js"`).\n' +
				'Default directories are:\n' +
				`\t - "${DEFAULT_APP_ROUTER}"\n` +
				`\t - "${DEFAULT_ENGINES_ROUTER}"`
		}
	],

	run(commandOptions) {
		const globs = (commandOptions.globs || [DEFAULT_APP_ROUTER, DEFAULT_ENGINES_ROUTER]).reduce((acc, glob) => {
			if (glob.match(/\/?lib\//)) {
				acc.engines.push(glob);
			} else {
				acc.app.push(glob);
			}

			return acc;
		}, {
			app: [],
			engines: []
		});

		const result = {
			name: 'Application',
			children: [
				parseEngineRoutes(globs.engines),
				parseAppRoutes(globs.app)
			]
		};
		const resultStr = JSON.stringify(result);

		// Write JSON output file.
		let outputDir = commandOptions.output;

		if (outputDir) {
			outputDir = resolveDir(outputDir || '');
			if (!fs.existsSync(outputDir)) {
				mkdirp.sync(outputDir);
			}

			const flatNodes = flat(result);
			const nodesCount = (Object.keys(flatNodes).filter((n) => n.endsWith('.name')) || []).length;

			fs.writeFileSync(path.join(outputDir, 'route-map.json'), resultStr, 'utf8');

			if (commandOptions.pretty) {
				const templateDir = path.resolve(__dirname, '..', 'templates');
				const treeTemplateDir = path.resolve(templateDir, 'tree.html');
				const tableTemplateDir = path.resolve(templateDir, 'table.html');
				const treeTemplate = lodash.template(fs.readFileSync(treeTemplateDir, 'utf-8'));
				const tableTemplate = lodash.template(fs.readFileSync(tableTemplateDir, 'utf-8'));

				fs.writeFileSync(path.join(outputDir, 'tree.html'), treeTemplate({ result: resultStr, nodesCount }), 'utf8');
				fs.writeFileSync(path.join(outputDir, 'table.html'), tableTemplate({ result: resultStr }), 'utf8');
			}
		} else {
			console.log(resultStr);
		}
	}

});
