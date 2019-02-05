const walk = require('acorn-walk');

module.exports = function parseContext(acc = [], ast, parent) {
	walk.simple(ast, {
		CallExpression(callExpression) {
			const { start, end, type, property: { name } = {} } = callExpression.callee;

			// Check if the expression matchs "this.route()"
			if (type === 'MemberExpression' && name === 'route') {
				const [route, ...rest] = callExpression.arguments;
				const routeData = { name: route.value, meta: {}, children: [], start, end };

				// Recursivity stuff, append as a child/root node
				if (parent) {
					parent.children.push(routeData);
				} else {
					acc.push(routeData);
				}

				// Loop over the n+1 arguments of the function
				rest.forEach((arg) => {
					// Argument is a function, maybe there are more nested routes inside it?
					if (arg.type === 'FunctionExpression') {
						// Check if there are more child routes
						parseContext(acc, arg.body, routeData);
						// Update the location of this context to be able to recognize the child routes
						routeData.start = arg.start;
						routeData.end = arg.end;
					// Route metadata, like "path" or other stuff
					} else if (arg.type === 'ObjectExpression') {
						arg.properties.forEach((prop) => {
							routeData.meta[prop.key.name] = prop.value.value;
						});
					}
				});
			}
		}
	});

	return acc;
};
