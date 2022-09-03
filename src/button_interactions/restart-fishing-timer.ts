import dayjs from 'dayjs';
import { ButtonInteraction, EmbedBuilder, time } from 'discord.js';
import * as schedule from 'node-schedule';
import { database } from '../api/mongo.js';
import { BotColors } from '../lib/constants.js';
import { initialiseDatabaseUser } from '../lib/functions/initialise-database-user.js';
import { postFishReminder } from '../lib/functions/post-fish-reminder.js';
import { disableOldButtons } from './start-fishing-timer.js';

export const restartFishingTimer = async (interaction: ButtonInteraction): Promise<void> => {
	await interaction.deferReply({ ephemeral: true });
	const data = JSON.parse(interaction.customId);

	if (data.userID !== interaction.user.id) {
		interaction.editReply('This button is not for you!');
		return;
	}

	await initialiseDatabaseUser(interaction.user.id);
	const userConfig = await database.userConfig.findOne({
		userID: interaction.user.id
	});

	const fishReminderEndTimestamp = dayjs().valueOf() + userConfig.timerCooldown * 60 * 1000;
	const fishReminderEndDate = dayjs(fishReminderEndTimestamp).toDate();

	const embedBase = new EmbedBuilder()
		.setAuthor({
			name: interaction.user.tag,
			iconURL: interaction.user.displayAvatarURL()
		})
		.setTitle('Fishing Reminder');

	if (data.disableButtons) {
		const newButtons = disableOldButtons(interaction, 2);
		await interaction.message.edit({ components: [newButtons] });
	}

	if (typeof schedule.scheduledJobs[interaction.user.id] !== 'undefined') {
		schedule.scheduledJobs[interaction.user.id].cancel();
	}
	schedule.scheduleJob(interaction.user.id, fishReminderEndDate, () => {
		postFishReminder(interaction.client, interaction.user.id, interaction.channelId, false);
	});

	await database.userConfig.updateOne({
		userID: interaction.user.id
	}, {
		channelID: interaction.channelId,
		timerActive: true,
		timerEndTimestamp: fishReminderEndTimestamp
	});

	const timerStartedEmbed = EmbedBuilder.from(embedBase)
		.setDescription(`**Timer restarted!**\
		\nI will DM you when your timer expires ${time(Math.round(fishReminderEndTimestamp / 1000), 'R')}.`)
		.setColor(BotColors.Positive);

	interaction.editReply({ embeds: [timerStartedEmbed] });
};
