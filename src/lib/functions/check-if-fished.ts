import { Message } from 'discord.js';
import { handleFish } from './handle-fish.js';
import { sleep } from './sleep.js';

export const checkIfMemberFished = async (message: Message): Promise<void> => {
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
	const isFishingEmbed = messageEmbed.title.startsWith('Location');

	if (!isFishingEmbed) {
		return;
	}

	const userID = fetchedMessage.interaction.user.id as string;
	const userWhoFished = await message.client.users.fetch(userID);

	handleFish(message, userWhoFished);
};
