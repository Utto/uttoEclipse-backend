import Mongoose from 'mongoose';

Mongoose.connect(''); // put your db here
const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('Connection with database succeeded.');
});

export default db;
