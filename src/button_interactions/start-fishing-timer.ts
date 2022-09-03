import dayjs from 'dayjs';
import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonInteraction, ButtonStyle, EmbedBuilder, time } from 'discord.js';
import * as schedule from 'node-schedule';
import { database } from '../api/mongo.js';
import { BotColors } from '../lib/constants.js';
import { initialiseDatabaseUser } from '../lib/functions/initialise-database-user.js';
import { postFishReminder } from '../lib/functions/post-fish-reminder.js';

export const disableOldButtons = (interaction: ButtonInteraction, indexOfHighlightedButton: number): ActionRowBuilder<ButtonBuilder> => {
	const buttons = interaction.message.components.at(0).components as Array<ButtonComponent>;

	const newButtons = new ActionRowBuilder<ButtonBuilder>();
	for (const button of buttons) {
		const index = buttons.indexOf(button);
		const buttonStyle = index === indexOfHighlightedButton ? button.style : ButtonStyle.Secondary;

		newButtons.addComponents(
			new ButtonBuilder()
				.setCustomId(button.customId)
				.setEmoji(button.emoji)
				.setLabel(button.label)
				.setStyle(buttonStyle)
				.setDisabled(true)
		);
	}

	return newButtons;
};

export const startFishingTimer = async (interaction: ButtonInteraction): Promise<void> => {
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

	const newButtons = disableOldButtons(interaction, 0);
	await interaction.message.edit({ components: [newButtons] });

	if (userConfig.timerActive) {
		const timerActiveEmbed = EmbedBuilder.from(embedBase)
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL()
			})
			.setTitle('Fishing Reminder')
			.setDescription(`Oops! Looks like you already have an active timer.\
			\n*Expires ${time(Math.round(userConfig.timerEndTimestamp / 1000), 'R')}*`)
			.setColor(BotColors.Negative);

		const restartButton = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setCustomId(JSON.stringify({ type: 'restartFishTimer', userID: interaction.user.id, disableButtons: false }))
				.setEmoji('🔁')
				.setLabel('Restart')
				.setStyle(ButtonStyle.Primary)
		);

		interaction.editReply({ embeds: [timerActiveEmbed], components: [restartButton] });
		return;
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
		.setDescription(`**Timer started!**\
		\nI will DM you when your timer expires ${time(Math.round(fishReminderEndTimestamp / 1000), 'R')}.`)
		.setColor(BotColors.Positive);

	interaction.editReply({ embeds: [timerStartedEmbed] });
};
