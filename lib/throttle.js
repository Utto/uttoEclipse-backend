
export default (axios, interval) => {
	let lastRequest;
	const interceptor = (config) => {
		const now = Date.now();
		if (lastRequest && now < lastRequest + interval) {
			return new Promise((resolve) => {
				setTimeout(() => resolve(config), interval);
			});
		}
		lastRequest = now;
		return config;
	};
	axios.interceptors.request.use(interceptor);
	return axios;
};
