export type Word = {
	word: string;
	partOfSpeech: string;
	definition: string;
	derivation?: string;
	contributor?: string;
	successor?: string;
	relatedWords: string[];

	key: string;
	searchable: string;
	searchableWord: string;
};

export const partOfSpeechNames: Record<string, string> = {
	ToS: 'speech act',
	aux: 'auxiliary',
	conj: 'conjunction',
	evid: 'evidence',
	fix: 'affix',
	interj: 'interjection',
	n: 'noun',
	phrase: 'phrase',
	post: 'postposition',
	pron: 'pronoun',
	quant: 'quantity',
	rep: 'repetition',
	v: 'verb'
};
