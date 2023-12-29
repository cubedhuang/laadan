import { json } from '@sveltejs/kit';
import type { Word } from '$lib/types';

import type { RequestHandler } from './$types';

function fetchSource(fetcher: typeof fetch) {
	// Decode ANSI text
	return fetcher('http://www.laadanlanguage.org/l2e.html')
		.then(r => r.arrayBuffer())
		.then(b => new TextDecoder('windows-1252').decode(b));
}

function cleanSource(source: string) {
	return source
		.replaceAll('\r', '')
		.replaceAll('…', '...')
		.replaceAll('“', '"')
		.replaceAll('”', '"')
		.replaceAll('’', "'");
}

function parseHtmlEntities(str: string) {
	return str.replace(/&(.)acute;/g, '$1\u0301');
}

function normalize(str: string) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

export const GET: RequestHandler = async ({ fetch }) => {
	const rawSource = await fetchSource(fetch);
	const source = cleanSource(rawSource);

	console.log(source);

	const rawWordsRegex = /<dt>(.+?)<\/dt>\n\t<dd>((?:.|\n)+?)<\/dd>/g;
	const rawWordData = [...source.matchAll(rawWordsRegex)].map(
		([, word, data]) => ({
			word: parseHtmlEntities(word),
			data: parseHtmlEntities(data).replaceAll(/\s+/g, ' ').trim()
		})
	);

	const dataRegex =
		/^(?:<i>\(OBSOLETE&mdash;see instead: (.+?)\)<\/i> )?\((.+?)\) (?:\[(.+?)\] )?(.+?)(?: {(.+?)})?(?: <i>See also: (.+?)<\/i>)?$/gm;

	const words: Word[] = [];

	for (const { word, data } of rawWordData) {
		const [
			,
			successor,
			partOfSpeech,
			derivation,
			definition,
			contributor,
			relatedWords
		] = [...data.matchAll(dataRegex)][0];

		words.push({
			word,
			partOfSpeech,
			definition,
			derivation,
			contributor,
			successor,
			relatedWords: relatedWords?.split(', ') ?? [],
			searchable: `${normalize(word)} ${normalize(definition)}`
		});
	}

	return json(words);
};
