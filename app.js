import Hapi from 'hapi';
import { execute, subscribe } from 'graphql';
import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import executableSchema from './graphql/executableSchema';
import authMiddleware from './lib/middleware';
import eclipse from './eclipse';

const port = process.env.PORT || 3000;

(async () => {
	const server = new Hapi.Server({
		routes: {
			cors: {
				credentials: true,
				origin: ['*'],
			},
		},
		port,
	});

	server.state('token', {
		path: '/',
		isHttpOnly: false,
		isSecure: false,
		isSameSite: false,
		encoding: 'none',
	});

	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: async (request) => {
				return {
					schema: executableSchema,
					context: { request },
				};
			},
			route: {
				cors: true,
				pre: [
					{ method: authMiddleware, assign: 'handler' },
				],
			},
		},
	});

	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql',
			},
		},
	});

	await eclipse.connect();

	await server.start();

	new SubscriptionServer({
		execute,
		subscribe,
		schema: executableSchema,
	}, {
		server: server.listener,
	});

	console.log('Server is up and running');
})();
