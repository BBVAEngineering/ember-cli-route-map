import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
	this.route('engine', { path: 'engine/:id' }, function() {
		this.route('engine-child', function() {
			this.route('engine-deep', { path: ':id' });
		});
	});
});
