import { PubSub, withFilter } from 'graphql-subscriptions';
import eclipse from '../eclipse';
import config from '../eclipse/config';

const pubsub = new PubSub();

const resolver = models => ({
	Query: {
		getPostByAuthor(root, { user }) {
			return models.Post.find({ user }).then(response => response);
		},
		getPosts(root, { checked }) {
			const isArg = checked !== undefined;
			return models.Post.find({ ...isArg && { checked } }).then(response => response);
		},
	},
	Mutation: {
		createPost(root, args) {
			const post = new models.Post(args);
			post.date = Date.now();
			return post.save().then((response) => {
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
		auth(root, _, context) {
			const { data } = context.request.pre.handler;
			return data;
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
