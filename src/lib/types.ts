export type Word = {
	word: string;
	partOfSpeech: string;
	definition: string;
	derivation?: string;
	contributor?: string;
	successor?: string;
	relatedWords: string[];

	searchable: string;
};
