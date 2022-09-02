import { ButtonInteraction, Interaction } from 'discord.js';
import { buttonInteractions } from '../button_interactions/index.js';

export const handleInteraction = (interaction: Interaction): void => {
	if (interaction.isButton) {
		const buttonInteract = interaction as ButtonInteraction;
		const type = JSON.parse(buttonInteract.customId).type;

		if (type in buttonInteractions) {
			buttonInteractions[type](buttonInteract);
		}
	}
};
