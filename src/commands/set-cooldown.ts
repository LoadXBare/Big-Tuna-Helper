import { EmbedBuilder } from 'discord.js';
import { database } from '../api/mongo.js';
import { BotCommand } from '../index.js';
import { BotColors } from '../lib/constants.js';
import { initialiseDatabaseUser } from '../lib/functions/initialise-database-user.js';

export const setCooldown = async (botCommand: BotCommand): Promise<void> => {
	const { commandArguments, message } = botCommand;
	const cooldown = parseInt(commandArguments.shift() ?? 'undefined');

	if (cooldown <= 0 || isNaN(cooldown)) {
		const invalidCooldownEmbed = new EmbedBuilder()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL()
			})
			.setTitle('Cooldown')
			.setDescription('Oops! Looks like your cooldown isn\'t greater than zero.')
			.setColor(BotColors.Negative);

		message.reply({ embeds: [invalidCooldownEmbed] });
		return;
	}

	await initialiseDatabaseUser(message.author.id);
	await database.userConfig.updateOne({
		userID: message.author.id
	}, {
		timerCooldown: cooldown
	});

	const cooldownUpdatedEmbed = new EmbedBuilder()
		.setAuthor({
			name: message.author.tag,
			iconURL: message.author.displayAvatarURL()
		})
		.setTitle('Cooldown')
		.setDescription(`Successfully set your cooldown to **${cooldown} minutes**!`)
		.setColor(BotColors.Positive);

	message.reply({ embeds: [cooldownUpdatedEmbed] });
};
