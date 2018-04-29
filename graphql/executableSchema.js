import { makeExecutableSchema } from 'graphql-tools';

import schema from './schema.graphql';
import createResolvers from './resolver';
import Post from '../models/posts';
import User from '../models/users';

const executableSchema = makeExecutableSchema({
	typeDefs: [schema],
	resolvers: createResolvers({ Post, User }),
});

export default executableSchema;
