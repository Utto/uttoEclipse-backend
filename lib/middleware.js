import {
	getAccessToken,
	getUserData,
	findOrCreateUser,
} from './';

function auth(code) {
	return new Promise((resolve, reject) => {
		getAccessToken(code)
			.then(res => getUserData(res.data.access_token))
			.then(res => findOrCreateUser(res))
			.then(res => resolve(res))
			.catch(err => reject(err));
	});
}

export default (req, h) => {
	console.log('Testing!');
	// h.state('token', 'testing'); works
	let token; // temporary
	if (!token) {
		const { code } = req.payload.variables;
		// if (!code) throw new Error(); // disabled because logic isn't finished yet
		return auth(code)
			.then((res) => {
				h.state('token', res.token); // never sets in application
				h.data = res.data;
				return h;
			});
	}
	/*
	return checkExpirationTime(token)
	*/
};

/*
function checkExpirationTime(data) {
	get user by id;
	check the time saved in db;
	optionally re-auth (validate? etc);
	re-write new time to user object;
	if token isn't expired, just continue
}
*/
