import { browser } from '$app/environment';
import { type Writable, writable, get } from 'svelte/store';

export function savedWritable<T>(
	key: string,
	initialValue: T,
	validator?: (value: T) => boolean
): Writable<T> {
	key = 'laadan:' + key;

	const store = writable(initialValue);

	if (browser) {
		const json = localStorage.getItem(key);
		if (json !== null && (!validator || validator(JSON.parse(json)))) {
			store.set(JSON.parse(json));
		}
	}

	const savedStore = {
		subscribe: store.subscribe,
		set(value: T) {
			if (browser) {
				localStorage.setItem(key, JSON.stringify(value));
			}
			store.set(value);
		},
		update(fn: (value: T) => T) {
			const value = fn(get(store));
			this.set(value);
		}
	};

	return savedStore;
}

export const view = savedWritable<'grid' | 'compact'>('view', 'grid');
