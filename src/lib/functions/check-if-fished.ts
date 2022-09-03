import { Message } from 'discord.js';
import { handleFish } from './handle-fish.js';
import { sleep } from './sleep.js';

export const checkIfMemberFished = async (message: Message): Promise<void> => {
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
	const isFishingEmbed = messageEmbed.title.startsWith('Location');

	if (!isFishingEmbed) {
		return;
	}

	const userID = message.interaction.user.id as string;
	const userWhoFished = await message.client.users.fetch(userID);

	handleFish(message, userWhoFished);
};
