<script lang="ts">
	import type { Word } from '$lib/types.js';

	import Popup from '$lib/components/Popup.svelte';

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
</script>

<h1 class="text-3xl font-bold">Láadan Dictionary</h1>
<p class="mt-2">An interactive dictionary for Láadan.</p>

<div class="mt-6">
	<input
		class="w-full max-w-sm px-4 py-2 input"
		placeholder="Search..."
		type="search"
		bind:value={search}
	/>
</div>

<div class="mt-4">
	{#each currentWords as word (word)}
		<p>
			<button
				class="font-bold hv:text-blue-500 transition"
				on:click={() => {
					if (selectedWord === word) {
						selectedWord = null;
					} else {
						selectedWord = word;
					}
				}}
			>
				{word.word}
			</button>

			<span class="text-xs text-gray-400">
				({word.partOfSpeech})
			</span>

			{word.definition}
		</p>
	{/each}
</div>

{#if obsoleteWords.length > 0}
	<h2 class="mt-8 mb-4 text-2xl font-bold">Obsolete Words</h2>

	{#each obsoleteWords as word (word)}
		<p>
			<button
				class="font-bold hv:text-blue-500 transition"
				on:click={() => {
					if (selectedWord === word) {
						selectedWord = null;
					} else {
						selectedWord = word;
					}
				}}
			>
				{word.word}
			</button>

			<span class="text-xs text-gray-400">
				({word.partOfSpeech})
			</span>

			<span>
				obsolete &middot; see {word.successor}
			</span>

			<span class="text-gray-400">
				&middot;

				{word.definition}
			</span>
		</p>
	{/each}
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
