import { Message, MessageReaction, User } from 'discord.js';
import { evaluateBaitShop } from './evaluate-bait-shop.js';
import { sleep } from './sleep.js';

export const checkIfBaitShop = async (message: Message): Promise<void> => {
	const authorIsBigTuna = message.author.id === '803361191166607370';
	const messageIsInteraction = message.interaction !== null;
	if (!authorIsBigTuna || !messageIsInteraction) {
		return;
	}

	const oldEmbedLength = message.embeds.length;
	const oldContentLength = message.content.length;
	let loopNumber = 0;

	do {
		sleep(100);
		await message.fetch();

		if ((loopNumber += 1) >= 50) {
			break;
		}
	} while (oldEmbedLength === message.embeds.length && oldContentLength === message.content.length);

	const messageContainsEmbed = message.embeds.length !== 0;
	if (!messageContainsEmbed) {
		return;
	}

	const messageEmbed = message.embeds.at(0);
	const isBaitShopEmbed = messageEmbed.title === 'Welcome to the Bait Shop!';
	if (!isBaitShopEmbed) {
		return;
	}

	await message.react('🔍');

	const reactionFilter = (reaction: MessageReaction, user: User): boolean => {
		return reaction.emoji.name === '🔍' && !user.bot;
	};

	const reactions = await message.awaitReactions({ filter: reactionFilter, idle: 10000, max: 1 });
	if (reactions.size === 0) {
		await message.reactions.removeAll();
		return;
	}

	await message.reactions.removeAll();

	evaluateBaitShop(message, messageEmbed);
};
