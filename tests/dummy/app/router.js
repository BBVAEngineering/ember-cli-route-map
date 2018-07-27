import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
	this.route('prev');

	this.route('main', { path: '/foo' }, function() {
		this.route('child', function() {
			this.route('deep');
		});
	});

	this.route('next', { foo: 'bar' });

	this.mount('foo');
});

export default Router;
