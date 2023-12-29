<script lang="ts">
	import type { Word } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let word: Word;

	const dispatch = createEventDispatcher<{ select: Word }>();
</script>

<button
	class="p-6 interactive flex flex-col items-start text-left"
	on:click={() => dispatch('select', word)}
>
	<h2 class="text-xl font-bold">
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

	<p class="mt-2" class:text-gray-400={word.successor}>
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
</button>
