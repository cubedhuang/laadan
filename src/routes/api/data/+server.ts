import { json } from '@sveltejs/kit';
import type { Word } from '$lib/types';

import type { RequestHandler } from './$types';

function fetchSource(fetcher: typeof fetch) {
	// Decode iso-8859-1 text
	return fetcher('http://www.laadanlanguage.org/l2e.html')
		.then(r => r.arrayBuffer())
		.then(b => new TextDecoder('iso-8859-1').decode(b));
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
	return str.replaceAll(/&(.)acute;/g, '$1\u0301').replaceAll('&mdash;', '—');
}

function normalize(str: string) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	const rawSource = await fetchSource(fetch);
	const source = cleanSource(rawSource);

	console.log(source);

	const rawWordsRegex = /<dt>(.+?)<\/dt>\n\t<dd>((?:.|\n)+?)<\/dd>/g;
	const rawWordData = [...source.matchAll(rawWordsRegex)].map(
		([, word, data]) => ({
			word: parseHtmlEntities(word),
			data: parseHtmlEntities(data.replaceAll(/\s+/g, ' ').trim())
		})
	);

	const dataRegex =
		/^(?:<i>\(OBSOLETE—see instead: (.+?)\)<\/i> )?\((.+?)\) (?:\[(.+?)\] )?(.+?)(?: {(.+?)})?(?: <i>See also: (.+?)<\/i>)?$/gm;

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
			key: words.length.toString(),
			searchable: `${normalize(word)} ${normalize(definition)}`
		});
	}

	setHeaders({
		'Cache-Control': 'public, s-maxage=31536000, max-age=31536000'
	});

	return json(words);
};
