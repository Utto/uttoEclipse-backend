import { makeExecutableSchema } from 'graphql-tools';

import schema from './schema.graphql';
import createResolvers from './resolver';
import Post from '../models/posts';

const executableSchema = makeExecutableSchema({
	typeDefs: [schema],
	resolvers: createResolvers({ Post }),
});

export default executableSchema;
