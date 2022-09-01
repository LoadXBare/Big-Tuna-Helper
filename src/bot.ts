import { Client, GatewayIntentBits } from 'discord.js';
import { database } from './api/mongo.js';
import { handleCommand } from './lib/command-handler.js';
import { BotPrefix, botToken } from './lib/constants.js';
import { checkIfBaitInventory } from './lib/functions/check-if-bait-inventory.js';
import { checkIfBaitShop } from './lib/functions/check-if-bait-shop.js';
import { checkIfMemberFished } from './lib/functions/check-if-fished.js';
import { startScheduler } from './lib/scheduler.js';

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions
	]
});

client.on('messageCreate', (message) => {
	if (message.content.startsWith(BotPrefix)) {
		handleCommand(message);
		return;
	}

	checkIfMemberFished(message);
	checkIfBaitShop(message);
	checkIfBaitInventory(message);
});

client.on('ready', async () => {
	await database.connectToDatabase();
	startScheduler(client);
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(botToken);
