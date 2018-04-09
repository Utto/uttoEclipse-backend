import Promise from 'bluebird';
import path from 'path';
import eclipse from './connect';

const fs = Promise.promisifyAll(require('fs'));


fs.readdirAsync(path.join(__dirname, '/lib'))
	.mapSeries((file) => {
		const madness = require(path.join(__dirname, '/lib', file)).default({ eclipse }); // eslint-disable-line
		for (const obsession in madness) {
			eclipse.on('chat', (channel, user, message, self) => {
				let args;
				if (madness[obsession].keyword) {
					if (!message.startsWith('!' + madness[obsession].keyword)) return;
					if (madness[obsession].args) {
						args = message.slice(madness[obsession].keyword.length + 1, message.length).split(',');
					}
				}
				madness[obsession].f(channel, user, message, self, args);
			});
			eclipse.on('action', (channel, user, message, self) => {
				let args;
				madness[obsession].f(channel, user, message, self, args);
			});
		}
		console.log('Loaded', file);
	});

export default eclipse;
