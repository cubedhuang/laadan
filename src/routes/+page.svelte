<script lang="ts">
	import { distance } from 'fastest-levenshtein';
	import VirtualScroll from 'svelte-virtual-scroll-list';

	import { partOfSpeechNames, type Word } from '$lib/types';

	import Popup from '$lib/components/Popup.svelte';
	import WordLine from './WordLine.svelte';
	import { view } from '$lib/stores';
	import WordSpace from './WordSpace.svelte';

	export let data;

	$: words = data.words;
	$: partsOfSpeech = data.partsOfSpeech;

	let shownPartsOfSpeech = data.partsOfSpeech.slice();

	let search = '';

	$: fixedSearch = search.trim().toLowerCase();

	$: usedWords = words.filter(word =>
		shownPartsOfSpeech.includes(word.partOfSpeech)
	);

	$: filteredWords = search
		? usedWords.filter(word => word.searchable.includes(fixedSearch))
		: usedWords;

	$: sortedWords = search
		? filteredWords.sort((a, b) => {
				const aDistance = distance(a.searchableWord, fixedSearch);
				const bDistance = distance(b.searchableWord, fixedSearch);

				if (aDistance > 2 && bDistance > 2) {
					const ai = a.searchableWord.indexOf(fixedSearch);
					const bi = b.searchableWord.indexOf(fixedSearch);

					if (ai !== -1 && bi !== -1) {
						return ai - bi;
					}

					if (ai !== -1) {
						return -1;
					}

					if (bi !== -1) {
						return 1;
					}

					return 0;
				}

				return aDistance - bDistance;
			})
		: filteredWords;

	$: currentWords = sortedWords.filter(word => !word.successor);
	$: obsoleteWords = sortedWords.filter(word => word.successor);

	let selectedWord: Word | null = null;

	function handleSelect(event: CustomEvent<Word>) {
		const word = event.detail;

		if (selectedWord === word) {
			selectedWord = null;
		} else {
			selectedWord = word;
		}
	}

	function group6<T>(array: T[]): T[][] {
		const result: T[][] = [];

		for (let i = 0; i < array.length; i += 6) {
			const group = array.slice(i, i + 6);

			// @ts-expect-error Required for VirtualScroll
			group.key = i;

			result.push(group);
		}

		return result;
	}
</script>

<svelte:head>
	<title>Láadan Dictionary</title>
	<meta name="description" content="An interactive dictionary for Láadan." />

	<meta property="og:title" content="Láadan Dictionary" />
	<meta
		property="og:description"
		content="An interactive dictionary for Láadan."
	/>
</svelte:head>

<h1 class="text-3xl font-bold">Láadan Dictionary</h1>
<p class="mt-2">An interactive dictionary for Láadan.</p>

<div class="mt-6">
	<select class="px-4 py-1 input cursor-pointer" bind:value={$view}>
		<option value="grid">Tiles</option>
		<option value="list">List</option>
	</select>
</div>

<div class="mt-2 flex gap-1 flex-wrap">
	{#each partsOfSpeech as partOfSpeech}
		{@const active = shownPartsOfSpeech.includes(partOfSpeech)}

		<label
			class="interactive px-3 py-0.5 {active
				? 'bg-purple-200'
				: 'text-gray-400'}"
		>
			<input
				class="sr-only"
				type="checkbox"
				bind:group={shownPartsOfSpeech}
				value={partOfSpeech}
			/>

			{partOfSpeechNames[partOfSpeech]}
		</label>
	{/each}
</div>

<div class="mt-2">
	<input
		class="w-full max-w-sm px-4 py-2 input"
		placeholder="Search..."
		type="search"
		bind:value={search}
	/>
</div>

<div class="mt-4">
	{#if $view === 'grid'}
		{@const groupedWords = group6(currentWords)}

		<VirtualScroll data={groupedWords} key="key" let:data pageMode>
			<div class="mb-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data as word (word.key)}
					<WordSpace {word} on:select={handleSelect} />
				{/each}
			</div>
		</VirtualScroll>
	{:else}
		<VirtualScroll
			data={currentWords}
			key="key"
			let:data
			pageMode
			keeps={80}
		>
			<WordLine word={data} on:select={handleSelect} />
		</VirtualScroll>
	{/if}
</div>

{#if obsoleteWords.length > 0}
	<h2 class="mt-8 mb-4 text-2xl font-bold">Obsolete Words</h2>

	{#if $view === 'grid'}
		{@const groupedWords = group6(obsoleteWords)}

		<VirtualScroll data={groupedWords} key="key" let:data pageMode>
			<div class="mb-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data as word (word.key)}
					<WordSpace {word} on:select={handleSelect} />
				{/each}
			</div>
		</VirtualScroll>
	{:else}
		<VirtualScroll
			data={obsoleteWords}
			key="key"
			let:data
			pageMode
			keeps={80}
		>
			<WordLine word={data} on:select={handleSelect} />
		</VirtualScroll>
	{/if}
{/if}

<Popup bind:value={selectedWord} let:value={word}>
	<div class="flex gap-2 items-start justify-between">
		<h2 class="text-2xl font-bold">
			{word.word}
			<span class="font-normal text-base text-gray-400">
				{partOfSpeechNames[word.partOfSpeech]}
			</span>
		</h2>

		<button
			class="interactive p-1 shrink-0"
			aria-label="close"
			on:click={() => (selectedWord = null)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
				/>
			</svg>
		</button>
	</div>

	{#if word.successor}
		<p class="mt-2">
			obsolete &middot; see <b>{word.successor}</b>
		</p>
	{/if}

	<p class="mt-2">
		{word.definition}
	</p>

	{#if word.relatedWords.length}
		<p class="mt-2">
			see {#each word.relatedWords as related, i}
				<b>{related}</b>{#if i < word.relatedWords.length - 1},
				{/if}{/each}
		</p>
	{/if}

	{#if word.derivation}
		<p class="mt-2">
			from
			<i>{word.derivation}</i>
		</p>
	{/if}

	{#if word.contributor}
		<p class="mt-2">
			by <i>{word.contributor}</i>
		</p>
	{/if}
</Popup>
