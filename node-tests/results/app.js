module.exports = {
	name: 'Application',
	children: [
		{
			name: 'engines',
			children: []
		}, {
			name: 'app',
			children: [
				{
					name: 'prev',
					meta: {},
					children: []
				}, {
					name: 'main',
					meta: {
						path: '/foo'
					},
					children: [{
						name: 'child',
						meta: {},
						children: [{
							name: 'deep',
							meta: {},
							children: []
						}]
					}]
				}, {
					name: 'next',
					meta: {
						foo: 'bar'
					},
					children: []
				}
			]
		}
	]
};
