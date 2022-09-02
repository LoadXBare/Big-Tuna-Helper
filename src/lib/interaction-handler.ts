import { ButtonInteraction, Interaction } from 'discord.js';
import { buttonInteractions } from '../button_interactions/index.js';

export const handleInteraction = (interaction: Interaction): void => {
	if (interaction.isButton) {
		const buttonInteract = interaction as ButtonInteraction;
		const interactionName = JSON.parse(buttonInteract.customId).type;

		if (interactionName in buttonInteractions) {
			buttonInteractions[interactionName](buttonInteract);
		}
	}
};
