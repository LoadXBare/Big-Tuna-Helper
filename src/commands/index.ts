import { Commands } from '../index.js';
import { setCooldown } from './set-cooldown.js';
import { timer } from './timer.js';

export const commands: Commands = {
	'set': setCooldown,
	'timer': timer
};
