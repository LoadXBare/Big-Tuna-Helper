import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, User } from 'discord.js';
import { database } from '../../api/mongo.js';
import { BotColors } from '../constants.js';
import { initialiseDatabaseUser } from './initialise-database-user.js';
import { sleep } from './sleep.js';

export const handleFish = async (message: Message, userWhoFished: User): Promise<void> => {
	await initialiseDatabaseUser(userWhoFished.id);
	const userConfig = await database.userConfig.findOne({
		userID: userWhoFished.id
	});

	const fishReminderEmbed = new EmbedBuilder()
		.setTitle('Fishing Reminder')
		.setAuthor({
			name: userWhoFished.tag,
			iconURL: userWhoFished.displayAvatarURL()
		})
		.setDescription(`It looks like you just fished, would you like me to start a timer of **${userConfig.timerCooldown}** minutes?`)
		.setColor(BotColors.Neutral);
	const fishReminderButtons = new ActionRowBuilder<ButtonBuilder>().setComponents(
		new ButtonBuilder()
			.setCustomId(JSON.stringify({ type: 'startFishTimer', userID: userWhoFished.id }))
			.setEmoji('👍')
			.setLabel('Start')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId(JSON.stringify({ type: 'dontStartFishTimer', userID: userWhoFished.id }))
			.setEmoji('👎')
			.setLabel('No')
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId(JSON.stringify({ type: 'restartFishTimer', userID: userWhoFished.id, disableButtons: true }))
			.setEmoji('🔁')
			.setLabel('Restart')
			.setStyle(ButtonStyle.Primary)
	);

	const reply = await message.channel.send({ embeds: [fishReminderEmbed], components: [fishReminderButtons] });

	await sleep(30_000);

	const fishReminderTimedoutEmbed = EmbedBuilder.from(fishReminderEmbed)
		.setFooter({ text: 'Timedout.' })
		.setColor(BotColors.Timeout);

	reply.edit({ embeds: [fishReminderTimedoutEmbed], components: [] });
};
