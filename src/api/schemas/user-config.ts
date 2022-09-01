import mongoose from 'mongoose';

const userConfigSchema = new mongoose.Schema({
	userID: { type: String, required: true },
	channelID: { type: String, required: true },
	timerCooldown: { type: Number, required: true },
	timerActive: { type: Boolean, required: true },
	timerEndTimestamp: { type: Number, required: true }
});

export const userConfig = mongoose.model('user-config', userConfigSchema);
