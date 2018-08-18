const escapeChars = (message) => {
	const escapedFirst = message.replace(/"/g, '\\"');
	const escapedSecond = escapedFirst.replace(/\\/g, '/');
	return escapedSecond;
};

export default escapeChars;
