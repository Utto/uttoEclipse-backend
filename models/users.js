import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const userSchema = new Schema({
	name: String,
	userId: String,
	time: String,
	permissions: Array,
});

const model = Mongoose.model('User', userSchema);

export default model;
