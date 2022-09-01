export const capitaliseString = (string: string): string => {
	const stringList = string.split(' ');
	const capitalisedString = stringList.map((string) => {
		return string[0].toUpperCase() + string.slice(1);
	}).join(' ');

	return capitalisedString;
};
