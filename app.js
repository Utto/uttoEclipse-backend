import Hapi from 'hapi';
import { execute, subscribe } from 'graphql';
import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import executableSchema from './graphql/executableSchema';
import eclipse from './eclipse';

const port = process.env.PORT || 4000;

(async () => {
	const server = new Hapi.Server({
		routes: { cors: true },
		port,
	});

	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: {
				schema: executableSchema,
			},
			route: {
				cors: true,
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
