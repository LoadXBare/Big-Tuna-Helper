import dayjs from 'dayjs';
import { Client } from 'discord.js';
import schedule from 'node-schedule';
import { database } from '../api/mongo.js';
import { postFishReminder } from './functions/post-fish-reminder.js';

export const startScheduler = async (client: Client): Promise<void> => {
	const userConfigs = await database.userConfig.find();

	for (const userConfig of userConfigs) {
		if (!userConfig.timerActive) {
			continue;
		}

		if (userConfig.timerEndTimestamp > dayjs().valueOf()) {
			const timerEndDate = dayjs(userConfig.timerEndTimestamp).toDate();

			schedule.scheduleJob(userConfig.userID, timerEndDate, () => {
				postFishReminder(client, userConfig.userID, userConfig.channelID, false);
			});
		}
		else {
			// timerEndTimestamp has already passed so post reminder and update database immediately
			postFishReminder(client, userConfig.userID, userConfig.channelID, true);
		}
	}
};
