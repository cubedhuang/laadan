<script lang="ts">
	import { partOfSpeechNames, type Word } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let word: Word;

	const dispatch = createEventDispatcher<{ select: Word }>();
</script>

<p>
	<button
		class="font-bold hv:text-blue-500 transition"
		on:click={() => {
			dispatch('select', word);
		}}
	>
		{word.word}
	</button>

	<span class="text-xs text-gray-400">
		({partOfSpeechNames[word.partOfSpeech]})
	</span>

	{#if word.successor}
		<span>
			obsolete &middot; see {word.successor}
		</span>
	{/if}

	<span class:text-gray-400={word.successor}>
		{#if word.successor}
			&middot;
		{/if}

		{word.definition}
	</span>
</p>
