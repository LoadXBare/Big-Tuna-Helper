import { Stopwatch } from '@sapphire/stopwatch';
import { Embed, EmbedBuilder, inlineCode, Message } from 'discord.js';
import { BaitDescriptionsList, BaitPriceList, BaitRatingsList, BotColors } from '../constants.js';

export const evaluateBaitShop = (message: Message, baitShopEmbed: Embed): void => {
	const stopwatch = new Stopwatch();
	const userBalance = parseInt(baitShopEmbed.description.match(/\d+/).shift());

	const baitShopEvaluationEmbed = new EmbedBuilder()
		.setTitle('Today\'s Bait Shop Evaluation')
		.setDescription('—————————————————————')
		.setColor(BotColors.Positive);

	for (const bait of baitShopEmbed.fields) {
		const index = baitShopEmbed.fields.indexOf(bait) + 1;
		const baitName = bait.name.match(/\s.+(?=x)/).shift().trim();
		const baitQuantity = parseInt(bait.name.match(/(?<=x)\d+/).shift());
		const baitPrice = parseInt(bait.value.match(/\d+/).shift());

		const pricePerBait = parseFloat((baitPrice / baitQuantity).toFixed(2));
		const recommendedPricePerBait = BaitPriceList[baitName];
		const difference = pricePerBait - recommendedPricePerBait;
		const baitRating = '⭐'.repeat(BaitRatingsList[baitName]);
		const temp = ((baitPrice / userBalance) * 100).toFixed(2);
		const pricingDifference = parseFloat(difference.toFixed(2));

		let pricingEmoji = '';
		if (pricingDifference <= -1) {
			pricingEmoji = '<:star:1014824711630364752>';
		}
		else if (pricingDifference <= 0) {
			pricingEmoji = '<:positive:1014824712800575498>';
		}
		else {
			pricingEmoji = '<:negative:1014824709973610538>';
		}

		let differenceText = '';
		if (difference < 0) {
			differenceText = `${pricingEmoji} ${baitName} are **UNDERPRICED** by ${Math.abs(pricingDifference)} 🍭!`;
		}
		else if (difference === 0) {
			differenceText = `${pricingEmoji} ${baitName} are **EQUAL TO** recommended price!`;
		}
		else {
			differenceText = `${pricingEmoji} ${baitName} are **OVERPRICED** by ${pricingDifference} 🍭!`;
		}

		baitShopEvaluationEmbed.addFields({
			name: `${inlineCode(`#${index}`)} ${baitName} x${baitQuantity} [${baitRating}]`,
			value: `**Price:** ${baitPrice} 🍭 [${temp}% of your ${userBalance} 🍭]\
			\n\n${BaitDescriptionsList[baitName]}\
			\n\n${differenceText}\
			\n—————————————————————`
		});
	}

	baitShopEvaluationEmbed.setFooter({ text: `This operation took ${stopwatch.stop().toString()}.` });
	message.channel.send({ embeds: [baitShopEvaluationEmbed] });
};
