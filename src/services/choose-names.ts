export const chooseNames = (
	slugs: string[],
): {
	giver: string;
	reciever: string;
}[] => {
	const pairs = [];

	const shuffled = slugs.sort(() => 0.5 - Math.random());

	for (let i = 0; i < shuffled.length; i++) {
		if (i === shuffled.length - 1) {
			pairs.push({ giver: shuffled[i], reciever: shuffled[0] });
			break;
		}

		pairs.push({ giver: shuffled[i], reciever: shuffled[i + 1] });
	}

	return pairs;
};
