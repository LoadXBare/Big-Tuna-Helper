import { BotCommand } from '../index.js';
import { handleFish } from '../lib/functions/handle-fish.js';

export const timer = (botCommand: BotCommand): void => {
	const { message } = botCommand;
	handleFish(message, message.author);
};
