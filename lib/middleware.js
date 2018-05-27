import {
	getUserData,
	findOrCreateUser,
	validateToken,
	updateTime,
} from './';

export default (req, h) => {
	const { token } = req.state;
	h.userData = {};
	if (token) {
		return getUserData(token)
			.then(res => findOrCreateUser(res))
			.then((res) => {
				const userDate = new Date(Number(res.data.time));

				if (userDate < Date.now() - 3600000) {
					console.log('token is expired');
					return validateToken(token)
						.then(response => updateTime(response.data.data[0].id))
						.catch((err) => {
							throw new Error(err);
						});
				}
				return res;
			})
			.then((res) => {
				h.userData = res;
				h.state('token', token);
				return h;
			})
			.catch(() => {
				console.log('err');
				h.unstate('token');
				return h;
			});
	}
	return h;
};
