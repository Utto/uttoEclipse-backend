const protect = (level, f) => {
	return (_, args, context) => {
		const { handler } = context.request.pre;
		const { data } = handler.userData;
		if (!data.permissions.includes(level)) throw new Error('You don\'t have a permission to access this data');
		return f(_, args);
	};
};

export default protect;
