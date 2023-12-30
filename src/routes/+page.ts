import type { Word } from '$lib/types.js';

export async function load({ fetch }) {
	const words = (await fetch('/api/data').then(r => r.json())) as Word[];

	return {
		words,
		partsOfSpeech: [...new Set(words.map(w => w.partOfSpeech))].sort()
	};
}
