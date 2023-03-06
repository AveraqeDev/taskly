<script lang="ts">
	import type { PageData } from './$types';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { IconFolderPlus, IconPlus } from '@tabler/icons-svelte';
	import BoardCard from '$lib/components/boardcard.svelte';
	import BoardForm from '$lib/components/boardform.svelte';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	const openForm = (_: MouseEvent): void => {
		const form: ModalSettings = {
			type: 'component',
			component: { ref: BoardForm },
			title: 'Add New Board',
			response: async (formData) => {
				if (formData) {
					await fetch('/api/board', { method: 'POST', body: JSON.stringify(formData) });
					await invalidateAll();
				}
			},
		};
		modalStore.trigger(form);
	};
</script>

<div class="flex flex-col gap-5 mt-5">
	<h1>My Boards</h1>
	<hr class="bg-surface-400" />
	{#if data.boards.length}
		<div class="grid grid-cols-4 grid-flow-row gap-4">
			{#each data.boards as board}
				<BoardCard {board} />
			{/each}
		</div>
	{:else}
		<div class="text-center">
			<IconFolderPlus size={48} class="mx-auto text-surface-400" />
			<h3 class="mt-2 text-sm font-medium">No boards</h3>
			<p class="mt-1 text-sm text-surface-500">Get started by creating a new board.</p>
			<div class="mt-6">
				<button on:click={openForm} type="button" class="btn variant-filled-primary rounded-full">
					<span><IconPlus /></span>
					<span>Add New Board</span>
				</button>
			</div>
		</div>
	{/if}
</div>
