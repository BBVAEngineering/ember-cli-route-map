const path = require('path');
const rimraf = require('rimraf');
const exec = require('child_process').exec;
const expect = require('chai').expect;
const routeMap = require('./results/app.js');

describe('Application', function() {
	const timeout = 5000;
	const output = 'myAppRoutes';

	this.timeout(timeout);

	afterEach(() => {
		rimraf.sync(output);
	});

	it('it generates the application routemap', async() => {
		const result = await runRouteMap();

		expect(result.error).to.not.exist;
		expect(JSON.parse(result.stdout)).to.be.deep.equal(routeMap);
	});

	it('it does not throw error when output dir does not exist', async() => {
		const result = await runRouteMap(output);

		expect(result.error).to.not.exist;
		expect(require('../myAppRoutes/route-map.json')).to.be.deep.equal(routeMap);
	});
});

function runRouteMap(output) {
	return new Promise((resolve) => {
		const outputDir = output ? `--output=${output}` : '';
		const command = `node_modules/.bin/ember route-map ${outputDir} --globs "tests/dummy/app/router.js"`;

		exec(command, {
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
