import { PubSub, withFilter } from 'graphql-subscriptions';
import eclipse from '../eclipse';
import config from '../eclipse/config';

import {
	getAccessToken,
	getUserData,
	findOrCreateUser,
} from '../lib';

import protect from '../lib/protected';

const pubsub = new PubSub();

const resolver = models => ({
	Query: {
		getPosts: protect('user', (_, args) => {
			const {
				filters,
				checked,
				id,
			} = args;

			const {
				user,
				message,
				startDate,
				endDate,
			} = filters;

			const isArg = checked !== undefined && checked !== null;

			return models.Post
				.find({
					...id && { _id: { $gt: id } },
					...isArg && { checked },
					...user && { user: { $regex: new RegExp(user) } },
					...message && { message: { $regex: new RegExp(message) } },
					...(startDate || endDate) && {
						date: {
							...startDate && { $gte: new Date(startDate).valueOf() },
							...endDate && { $lte: new Date(endDate).valueOf() },
						},
					},
				})
				.limit(10)
				.then(response => response)
				.catch(err => err);
		}),
	},
	Mutation: {
		createPost(root, args) {
			const post = new models.Post(args);
			post.date = Date.now();
			return post.save().then((response) => {
				console.log('saved', response);
				pubsub.publish('postCreated', { postCreated: response, checked: response.checked });
				return response;
			});
		},

		checkPost(root, { id, action, time }) {
			return models.Post.findById(id).then((response) => {
				if (action !== 'allow') {
					return eclipse[action](config.channels[0], response.user, time && time)
						.then(() => response)
						.catch(() => {
							throw new Error();
						});
				}
				return response;
			})
				.then((response) => {
					response.checked = true;
					return response.save()
						.then(res => res)
						.catch(() => {
							throw new Error();
						});
				})
				.catch((err) => {
					throw new Error('Could not apply action', err);
				});
		},
		auth(root, { code }, context) {
			const { handler } = context.request.pre;
			return getAccessToken(code)
				.then(res => getUserData(res.data.access_token))
				.then(res => findOrCreateUser(res))
				.then((res) => {
					handler.state('token', res.token);
					return res.data;
				})
				.catch(() => new Error('Login failed'));
		},
	},
	Subscription: {
		postCreated: {
			subscribe: withFilter(
				() => pubsub.asyncIterator('postCreated'),
				(payload, variables) => payload.checked === variables.checked,
			),
		},
	},
});

export default resolver;
