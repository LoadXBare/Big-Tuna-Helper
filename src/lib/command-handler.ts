import { Message } from 'discord.js';
import { commands } from '../commands/index.js';

export const handleCommand = (message: Message): void => {
	const commandArguments = message.content.split(' ');
	const command = commandArguments.shift().slice(1);
	const botCommand = {
		commandArguments,
		message
	};

	if (command in commands) {
		commands[command](botCommand);
	}
};
