<script lang="ts">
	import { fly } from 'svelte/transition';

	type T = $$Generic;

	export let value: T | null;
	export let key: (value: NonNullable<T>) => unknown = value => value;

	// Although the value at the <slot> is non-nullable, the type of `value` in
	// the let binding is still nullable, so this is a workaround to fix the
	// type.
	$: nonNullableValue = value!;
</script>

{#if value}
	<div
		transition:fly|local={{ y: 24, duration: 300 }}
		class="z-20 fixed bottom-0 right-0 w-full"
	>
		{#key key(value)}
			<div
				transition:fly|local={{ y: 24, duration: 300 }}
				class="box absolute p-6 bottom-0 left-0 right-0 max-sm:rounded-none max-sm:border-0 max-sm:border-t-2
					sm:w-96 sm:left-auto sm:bottom-8 sm:right-8 shadow-lg"
			>
				<slot value={nonNullableValue} />
			</div>
		{/key}
	</div>
{/if}
