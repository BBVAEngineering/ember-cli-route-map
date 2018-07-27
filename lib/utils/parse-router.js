const acorn = require('acorn');
const fs = require('fs');
const parseContext = require('../utils/parse-context.js');

function isNodeInside(child, parent) {
	return parent.start < child.start && parent.end > child.start;
}

function makeAST(file) {
	const content = fs.readFileSync(file, 'utf-8');

	return acorn.parse(content, {
		ecmaVersion: 8,
		locations: true,
		sourceType: 'module'
	});
}

function cleanNonChildrens(childrens) {
	return childrens.reduce((acc, route) => {
		const inside = childrens.find((bRoute) => isNodeInside(route, bRoute));

		if (!inside) {
			acc.push(route);
		}

		return acc;
	}, []);
}

function cleanRoute(route) {
	if (route.children.length) {
		route.children = cleanNonChildrens(route.children).map(cleanRoute);
	}

	delete route.start;
	delete route.end;

	return route;
}

module.exports = function parseRouter(file) {
	const ast = makeAST(file);
	const tree = [];

	parseContext(tree, ast);

	return cleanNonChildrens(tree).map(cleanRoute);
};
