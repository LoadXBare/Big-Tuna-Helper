import { Embed, EmbedBuilder, Message } from 'discord.js';
import { BaitPriceList, BotColors } from '../constants.js';

export const capitaliseString = (string: string): string => {
	const stringList = string.split(' ');
	const capitalisedString = stringList.map((string) => {
		return string[0].toUpperCase() + string.slice(1);
	}).join(' ');

	return capitalisedString;
};

export const evaluateBaitInventory = (message: Message, baitInventoryEmbed: Embed): void => {
	const baitList = baitInventoryEmbed.description.split('\n');

	let baitInventoryValue = 0;
	for (const bait of baitList) {
		const baitQuantity = parseInt(bait.match(/\d+/).shift());
		const baitName = capitaliseString(bait.match(/\s.+(?=\s\*)/).shift().trim());
		const baitValue = BaitPriceList[baitName];

		baitInventoryValue += baitValue * baitQuantity;
	}

	const baitInventoryValueEmbed = new EmbedBuilder()
		.setDescription(`Your bait inventory is worth approximately **${parseFloat((baitInventoryValue).toFixed(2)).toLocaleString()}** 🍭!`)
		.setColor(BotColors.Positive);

	message.reply({ embeds: [baitInventoryValueEmbed] });
};
