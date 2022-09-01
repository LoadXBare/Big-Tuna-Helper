import { Message, MessageReaction, User } from 'discord.js';
import { evaluateBaitInventory } from './evaluate-bait-inventory.js';
import { sleep } from './sleep.js';

export const checkIfBaitInventory = async (message: Message): Promise<void> => {
	const authorIsBigTuna = message.author.id === '803361191166607370';
	const messageIsInteraction = message.interaction !== null;
	if (!authorIsBigTuna || !messageIsInteraction) {
		return;
	}

	await sleep(500);
	const fetchedMessage = await message.fetch();

	const messageContainsEmbed = typeof fetchedMessage.embeds.at(0) !== 'undefined';
	if (!messageContainsEmbed) {
		return;
	}

	const messageEmbed = message.embeds.at(0);
	const isBaitInventoryEmbed = messageEmbed.title === 'Bait Inventory';
	if (!isBaitInventoryEmbed) {
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

	evaluateBaitInventory(message, messageEmbed);
};
