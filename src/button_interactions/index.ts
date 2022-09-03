import { ButtonInteractions } from '..';
import { dontStartFishingTimer } from './dont-start-fishing-timer.js';
import { restartFishingTimer } from './restart-fishing-timer.js';
import { startFishingTimer } from './start-fishing-timer.js';

export const buttonInteractions: ButtonInteractions = {
	'startFishTimer': startFishingTimer,
	'dontStartFishTimer': dontStartFishingTimer,
	'restartFishTimer': restartFishingTimer
};
