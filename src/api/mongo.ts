import mongoose from 'mongoose';
import { databaseInfo } from '../lib/constants.js';
import { userConfig } from './schemas/user-config.js';

const connectToDatabase = async (): Promise<void> => {
	await mongoose.connect(databaseInfo.url, {
		authSource: 'admin',
		user: databaseInfo.user,
		pass: databaseInfo.pass
	})
		.catch((e) => {
			console.log('An error occurred while connecting to the database!', e);
			return;
		});
	console.log('Successfully connected to MongoDB!');
};

export const database = {
	connectToDatabase,
	userConfig
};
