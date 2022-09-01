import dayjs from 'dayjs';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, Message, time, User } from 'discord.js';
import schedule from 'node-schedule';
import { database } from '../../api/mongo.js';
import { BotColors } from '../constants.js';
import { initialiseDatabaseUser } from './initialise-database-user.js';
import { postFishReminder } from './post-fish-reminder.js';

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
			.setCustomId('Yes')
			.setEmoji('👍')
			.setLabel('Start')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('No')
			.setEmoji('👎')
			.setLabel('No')
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId('Restart')
			.setEmoji('🔁')
			.setLabel('Restart')
			.setStyle(ButtonStyle.Primary)
	);

	const reply = await message.channel.send({ embeds: [fishReminderEmbed], components: [fishReminderButtons] });

	const filter = (interaction: ButtonInteraction): boolean => {
		return interaction.user.id === userWhoFished.id;
	};
	const buttonChoice = await message.channel.awaitMessageComponent({ componentType: ComponentType.Button, filter: filter, idle: 30_000 })
		.catch(() => {
			const fishReminderTimedoutEmbed = EmbedBuilder.from(fishReminderEmbed)
				.setFooter({ text: 'Timedout.' })
				.setColor(BotColors.Timeout);

			reply.edit({ embeds: [fishReminderTimedoutEmbed], components: [] });
		});

	if (typeof buttonChoice === 'undefined') {
		return;
	}

	if (buttonChoice.customId === 'No') {
		const fishReminderCancelledEmbed = EmbedBuilder.from(fishReminderEmbed)
			.setFooter({ text: 'Okay, timer not started.' })
			.setColor(BotColors.Negative);
		reply.edit({ embeds: [fishReminderCancelledEmbed], components: [] });
		return;
	}

	const fishReminderEndTimestamp = dayjs().valueOf() + userConfig.timerCooldown * 60 * 1000;
	const fishReminderEndDate = dayjs(fishReminderEndTimestamp).toDate();

	if (buttonChoice.customId === 'Yes' && userConfig.timerActive) {
		const fishReminderActiveEmbed = EmbedBuilder.from(fishReminderEmbed)
			.setDescription(`Oops! Looks like you already have an active timer.\
				\n*Expires ${time(Math.round(userConfig.timerEndTimestamp / 1000), 'R')}*`)
			.setColor(BotColors.Negative);

		reply.edit({ embeds: [fishReminderActiveEmbed], components: [] });
		return;
	}

	let restartedText = '';
	if (buttonChoice.customId === 'Restart' && userConfig.timerActive) {
		schedule.scheduledJobs[userWhoFished.id].cancel();
		restartedText = 're';
	}

	schedule.scheduleJob(userWhoFished.id, fishReminderEndDate, () => {
		postFishReminder(message.client, userWhoFished.id, message.channelId, false);
	});

	await database.userConfig.updateOne({
		userID: userWhoFished.id
	}, {
		channelID: message.channelId,
		timerActive: true,
		timerEndTimestamp: fishReminderEndTimestamp
	});

	const fishReminderStartedEmbed = EmbedBuilder.from(fishReminderEmbed)
		.setDescription(`**Timer ${restartedText}started!**\
		\nI will DM you when your timer expires ${time(Math.round(fishReminderEndTimestamp / 1000), 'R')}.`)
		.setColor(BotColors.Positive);

	reply.edit({ embeds: [fishReminderStartedEmbed], components: [] });
};
