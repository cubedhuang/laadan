<script lang="ts">
	import type { Word } from '$lib/types.js';

	import Popup from '$lib/components/Popup.svelte';
	import WordLine from './WordLine.svelte';
	import { view } from '$lib/stores';
	import WordSpace from './WordSpace.svelte';

	export let data;

	$: words = data.words;

	let search = '';

	$: fixedSearch = search.trim().toLowerCase();

	$: filteredWords = words.filter(word => {
		if (search === '') return true;

		return word.searchable.includes(fixedSearch);
	});

	$: currentWords = filteredWords.filter(word => !word.successor);
	$: obsoleteWords = filteredWords.filter(word => word.successor);

	let selectedWord: Word | null = null;

	function handleSelect(event: CustomEvent<Word>) {
		const word = event.detail;

		if (selectedWord === word) {
			selectedWord = null;
		} else {
			selectedWord = word;
		}
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
		<option value="grid">Grid</option>
		<option value="list">List</option>
	</select>
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
		<div class="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each currentWords as word (word)}
				<WordSpace {word} on:select={handleSelect} />
			{/each}
		</div>
	{:else}
		{#each currentWords as word (word)}
			<WordLine {word} on:select={handleSelect} />
		{/each}
	{/if}
</div>

{#if obsoleteWords.length > 0}
	<h2 class="mt-8 mb-4 text-2xl font-bold">Obsolete Words</h2>

	{#if $view === 'grid'}
		<div class="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each obsoleteWords as word (word)}
				<WordSpace {word} on:select={handleSelect} />
			{/each}
		</div>
	{:else}
		{#each obsoleteWords as word (word)}
			<WordLine {word} on:select={handleSelect} />
		{/each}
	{/if}
{/if}

<Popup bind:value={selectedWord} let:value={word}>
	<h2 class="text-2xl font-bold">
		{word.word}
		<span class="font-normal text-base text-gray-400">
			{word.partOfSpeech}
		</span>
	</h2>

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
