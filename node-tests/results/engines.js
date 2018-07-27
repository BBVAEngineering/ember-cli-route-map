module.exports = {
	name: 'Application',
	children: [{
		name: 'engines',
		children: [{
			name: 'bar',
			children: [{
				name: 'engine-prev',
				meta: {},
				children: []
			}, {
				name: 'engine-next',
				meta: {
					as: 'sa'
				},
				children: []
			}]
		}, {
			name: 'foo',
			children: [{
				name: 'engine',
				meta: {
					path: 'engine/:id'
				},
				children: [{
					name: 'engine-child',
					meta: {},
					children: [{
						name: 'engine-deep',
						meta: {
							path: ':id'
						},
						children: []
					}]
				}]
			}]
		}]
	}, {
		name: 'app',
		children: []
	}]
};
