import { Message } from 'discord.js';

interface BotCommand {
	message: Message,
	commandArguments: Array<string>
}

interface Commands {
	[command: string]: (botCommand: BotCommand) => Promise<void> | void
}

interface BaitPrices {
	[bait: string]: number
}

interface BaitRatings {
	[bait: string]: number
}

interface BaitDescriptions {
	[bait: string]: string
}
