'use strict';

const BuildCommand = require('ember-cli/lib/commands/build');

module.exports = BuildCommand.extend({
	name: 'route-map',

	description: 'Create an interactive map based in the existing routes in your Ember application.',

	availableOptions: [].concat(BuildCommand.prototype.availableOptions),

	run(commandOptions) {

	}

});
