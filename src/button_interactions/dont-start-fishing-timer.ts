import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { BotColors } from '../lib/constants.js';
import { disableOldButtons } from './start-fishing-timer.js';

export const dontStartFishingTimer = async (interaction: ButtonInteraction): Promise<void> => {
	await interaction.deferReply({ ephemeral: true });
	const data = JSON.parse(interaction.customId);

	if (data.userID !== interaction.user.id) {
		interaction.editReply('This button is not for you!');
		return;
	}

	const newButtons = disableOldButtons(interaction, 1);
	await interaction.message.edit({ components: [newButtons] });

	const timerNotStartedEmbed = new EmbedBuilder()
		.setAuthor({
			name: interaction.user.tag,
			iconURL: interaction.user.displayAvatarURL()
		})
		.setTitle('Fishing Reminder')
		.setDescription('Okay, fishing timer not started.')
		.setColor(BotColors.Negative);

	interaction.editReply({ embeds: [timerNotStartedEmbed] });
};
