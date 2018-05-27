import { graphql } from 'graphql';
import executableSchema from '../../graphql/executableSchema';

export const name = 'Logging';

export default () => ([
	{
		f: (channel, user, message) => {
			const has = Object.prototype.hasOwnProperty;
			const symbols = [':', ';', '=', '^', '%', '*', "'", '>', 'R', 'B', 'D', '8', '-'];
			const toCheck = {
				'(': ')',
			};
			const arr = [];
			let checked = true;
			let mod = false;
			let broadcaster = false;

			for (let i = 0; i < message.length; i++) {
				const prev = message.charAt(i - 1);
				const next = message.charAt(i + 1);
				if (has.call(toCheck, message[i]) && !symbols.includes(prev) && !symbols.includes(next)) {
					arr.push(message[i]);
				}

				if (message[i] === toCheck['('] && !symbols.includes(prev) && !symbols.includes(next)) {
					if (toCheck[arr[arr.length - 1]] !== message[i]) checked = false;
					arr.pop();
				}
			}

			if (arr.length) checked = false;
			if (user.badges.broadcaster) broadcaster = true;
			if (user.badges.moderator) mod = true;

			const post =
			`mutation {
				createPost(user: "${user.username}", message: "${message}", checked: ${checked}, mod: ${mod}, broadcaster: ${broadcaster}) {
					id,
					message
				} 
			}
		`;

			graphql(executableSchema, post)
				.then(result => result)
				.catch((err) => {
					console.log('err', err);
				});
		},
	},
]);
