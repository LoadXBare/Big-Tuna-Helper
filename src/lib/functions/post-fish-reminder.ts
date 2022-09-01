import { Client, EmbedBuilder, TextChannel, userMention } from 'discord.js';
import { database } from '../../api/mongo.js';
import { BotColors } from '../constants.js';

export const postFishReminder = async (client: Client, userID: string, channelID: string, late: boolean): Promise<void> => {
	const discordUser = await client.users.fetch(userID);
	const fishReminderEmbed = new EmbedBuilder()
		.setAuthor({
			name: discordUser.tag,
			iconURL: discordUser.displayAvatarURL()
		})
		.setTitle('Fishing Reminder')
		.setDescription('**Hey!**\
				\nYour fishing timer has expired.\
				\n\n**Go fish!** 🎣')
		.setColor(BotColors.Positive);

	if (late) {
		fishReminderEmbed.setFooter({ text: 'This reminder may have been sent late due to bot or Discord API outages!' });
	}

	discordUser.send({ embeds: [fishReminderEmbed] })
		.catch(async () => {
			const discordChannel = await client.channels.fetch(channelID) as TextChannel;
			discordChannel.send({
				content: `${userMention(userID)} I had some trouble reaching your DMs, regardless here is your reminder!`,
				embeds: [fishReminderEmbed]
			});
		});

	await database.userConfig.updateOne({
		userID: userID
	}, {
		timerActive: false
	});
};
