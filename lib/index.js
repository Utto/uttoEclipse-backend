import axios from 'axios';
import throttle from './throttle';

import config from '../config';
import User from '../models/users';

function getAccessToken(code) {
	const url = `https://id.twitch.tv/oauth2/token?client_id=${config.client_id}&client_secret=${config.client_secret}&code=${code}&grant_type=${config.grant_type}&redirect_uri=${config.redirect_uri}`;
	return axios.post(url)
		.then(res => res)
		.catch(err => err);
}

function getUserData(token) {
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const throttled = throttle(axios.create(), 600);
	return throttled.get('https://api.twitch.tv/helix/users', { headers })
		.then((res) => {
			const data = res.data.data[0];
			data.token = token;
			return data;
		})
		.catch(err => err);
}

function validateToken(token) {
	const headers = {
		Authorization: `Bearer ${token}`,
	};

	return axios.get('https://api.twitch.tv/helix/users', { headers })
		.then(res => res)
		.catch((err) => {
			throw new Error(err);
		});
}

function updateTime(id) {
	return User.findOne({ userId: id })
		.then((res) => {
			console.log('user is found', res);
			res.time = Date.now();
			return res.save()
				.then(saved => saved)
				.catch((err) => {
					throw new Error(err);
				});
		})
		.catch((err) => {
			throw new Error(err);
		});
}

function findOrCreateUser(user) {
	const { id, token } = user;
	return User.findOne({ userId: id })
		.then((res) => {
			if (!res) {
				const name = user.display_name;
				const newUser = new User({
					userId: id,
					time: Date.now(),
					permissions: [],
					name,
				});
				return newUser.save()
					.then(saved => saved)
					.catch(err => err);
			}
			return res;
		})
		.then((res) => {
			return { data: res, token };
		})
		.catch(err => err);
}

export {
	getAccessToken,
	getUserData,
	findOrCreateUser,
	validateToken,
	updateTime,
};
