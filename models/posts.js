import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const postSchema = new Schema({
	date: String,
	user: String,
	message: String,
	checked: Boolean,
});

const model = Mongoose.model('Post', postSchema);

export default model;
