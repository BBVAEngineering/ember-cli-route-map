import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
	this.route('engine-prev');

	this.route('engine-next', { as: 'sa' });
});
