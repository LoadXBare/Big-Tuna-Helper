import { Colors } from 'discord.js';
import { BaitDescriptions, BaitPrices, BaitRatings } from '..';

const botInDev = process.env.BOT_ENV === 'DEVELOPMENT';

export const BotPrefix = ',';

export const botToken = botInDev ? process.env.DEV_TOKEN : process.env.PROD_TOKEN;

export const databaseInfo = {
	url: botInDev ? process.env.DB_DEV_URL : process.env.DB_PROD_URL,
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
};

export const BotColors = {
	Neutral: Colors.Blue,
	Negative: Colors.Red,
	Positive: Colors.Green,
	Timeout: Colors.Grey
};

export const BaitPriceList: BaitPrices = {
	Corn: 1,
	Worms: 1.5,
	Peas: 1,
	Bloodworms: 1.5,
	Crickets: 2,
	Bread: 1.25,
	Minnows: 1,
	Meat: 2,
	Leeches: 3,
	Crayfish: 4.5,
	Maggots: 2.25,
	'Small Cutbait': 4.5,
	Shrimp: 4,
	Sardine: 2.5,
	Crab: 6,
	Liver: 9,
	Dragonfly: 5,
	'Medium Cutbait': 7,
	'Large Cutbait': 12,
	'Tuna Tail': 12,
	'Tuna Head': 18,
	'Tuna Chunks': 25,
	Wagyu: 18,
	'Huge Cutbait': 35,
	'Candy Cane': 40,
	'Bronze Egg': 20,
	'Silver Egg': 30,
	'Gold Egg': 60
};

export const BaitDescriptionsList: BaitDescriptions = {
	Corn: '• Minimum fish tier: **C**',
	Worms: '• Minimum fish tier: **B**',
	Peas: '• Catches exclusively **small** fish',
	Bloodworms: '• Minimum fish tier: **A**\n• Catches exclusively **small** fish\n• More likely to catch **panfish**',
	Crickets: '• Catches exclusively **medium** fish',
	Bread: '• Minimum fish tier: **C**\n• Catches exclusively **small** fish\n• More likely to catch **minnow**',
	Minnows: '• Catches exclusively **small, medium, large** fish\n• More likely to catch **trout, crappie**',
	Meat: '• Minimum fish tier: **A**',
	Leeches: '• Minimum fish tier: **B**\n• Catches exclusively **medium, large, extra large** fish\n• More likely to catch **perch**',
	Crayfish: '• Catches exclusively **large, extra large** fish',
	Maggots: '• Catches exclusively **medium, large, extra large** fish',
	'Small Cutbait': '• Minimum fish tier: **S**\n• More likely to catch **catfish**',
	Shrimp: '• Minimum fish tier: **A**\n• Catches exclusively **medium, large, extra large** fish\n• More likely to catch **catfish, pike**',
	Sardine: '• Minimum fish tier: **B**\n• Catches exclusively **medium, large** fish\n• More likely to catch **bass**',
	Crab: '• Minimum fish tier: **B**\n• Catches exclusively **large, extra large** fish',
	Liver: '• Catches exclusively **extra large** fish',
	Dragonfly: '• Minimum fish tier: **C**\n• Catches exclusively **large, extra large** fish\n• More likely to catch **carp**',
	'Medium Cutbait': '• Minimum fish tier: **S**\n• Catches exclusively **medium, large, extra large** fish\n• More likely to catch **gar**',
	'Large Cutbait': '• Minimum fish tier: **S**\n• Catches exclusively **large, extra large** fish\n• More likely to catch **sturgeon**',
	'Tuna Tail': '• Minimum fish tier: **C**\n• Catches exclusively **extra large** fish\n• More likely to catch **sturgeon**',
	'Tuna Head': '• Minimum fish tier: **B**\n• Catches exclusively **extra large** fish\n• More likely to catch **catfish**',
	'Tuna Chunks': '• Minimum fish tier: **A**\n• Catches exclusively **extra large** fish\n• More likely to catch **shark**',
	Wagyu: '• Minimum fish tier: **C**\n• Catches exclusively **extra large** fish\n• Temporary max weight increase by **50%**',
	'Huge Cutbait': '• Minimum fish tier: **S**\n• Catches exclusively **extra large** fish',
	'Candy Cane': '• Minimum fish tier: **SS**\n• Exclusive to events',
	'Bronze Egg': '• Minimum fish tier: **SS**\n• Catches exclusively **small** fish\n• Exclusive to events',
	'Silver Egg': '• Minimum fish tier: **SS**\n• Catches exclusively **medium** fish\n• Exclusive to events',
	'Gold Egg': '• Minimum fish tier: **SS**\n• Catches exclusively **large** fish\n• Exclusive to events'
};

export const BaitRatingsList: BaitRatings = {
	Corn: 1,
	Worms: 1,
	Peas: 1,
	Bloodworms: 1,
	Crickets: 1,
	Bread: 1,
	Minnows: 1,
	Meat: 2,
	Leeches: 2,
	Crayfish: 2,
	Maggots: 2,
	'Small Cutbait': 2,
	Shrimp: 2,
	Sardine: 2,
	Crab: 3,
	Liver: 3,
	Dragonfly: 3,
	'Medium Cutbait': 3,
	'Large Cutbait': 3,
	'Tuna Tail': 4,
	'Tuna Head': 4,
	'Tuna Chunks': 4,
	Wagyu: 4,
	'Huge Cutbait': 4,
	'Candy Cane': 4,
	'Bronze Egg': 4,
	'Silver Egg': 4,
	'Gold Egg': 4
};
