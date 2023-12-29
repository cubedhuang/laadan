import type { Word } from '$lib/types.js';

export async function load({ fetch }) {
	return {
		words: (await fetch('/api/data').then(r => r.json())) as Word[]
	};
}
