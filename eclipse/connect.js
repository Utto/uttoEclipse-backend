import tmi from 'tmi.js';

import config from './config';

console.log('Starting');

const options = {
	options: {
		debug: true,
	},
	connection: {
		reconnect: true,
	},
	identity: {
		username: config.username,
		password: config.password,
	},
	channels: config.channels,
};

const eclipse = new tmi.client(options); // eslint-disable-line new-cap

export default eclipse;
