import { database } from '../../api/mongo.js';

export const initialiseDatabaseUser = async (userID: string): Promise<void> => {
	const userConfig = await database.userConfig.findOne({
		userID: userID
	});

	if (userConfig === null) {
		await database.userConfig.create({
			channelID: 'undefined',
			timerActive: false,
			timerCooldown: 60,
			timerEndTimestamp: 0,
			userID: userID
		});
	}
};
