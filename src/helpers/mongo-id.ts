import mongoose from 'mongoose';

export default class MongoIdValidator {
	static isValid(id: string): boolean {
		return mongoose.Types.ObjectId.isValid(id);
	}
}