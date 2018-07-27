const path = require('path');
const exec = require('child_process').exec;
const expect = require('chai').expect;
const routeMap = require('./results/app.js');

describe('Application', function() {
	this.timeout(5000);

	it('it generates the application routemap', async function() {
		const result = await runRouteMap();

		expect(result.error).to.not.exist;
		expect(JSON.parse(result.stdout)).to.be.deep.equal(routeMap);
	});
});

function runRouteMap() {
	return new Promise((resolve) => {
		exec('node_modules/.bin/ember route-map --globs "tests/dummy/app/router.js"', {
			cwd: path.join(__dirname, '..'),
			env: process.env
		}, (error, stdout, stderr) => {
			resolve({
				error,
				stdout,
				stderr
			});
		});
	});
}
