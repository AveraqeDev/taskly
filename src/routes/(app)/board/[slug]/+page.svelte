<script lang="ts">
	import type { PageData } from './$types';
	import { IconPlus } from '@tabler/icons-svelte';
	import BoardColumn from '$lib/components/boardcolumn.svelte';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import ColumnForm from '$lib/components/columnform.svelte';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	$: tasksWithNoColumn = data.board.tasks.filter((task) => task.columnId === null);

	const openForm = (_: MouseEvent): void => {
		const form: ModalSettings = {
			type: 'component',
			component: { ref: ColumnForm },
			title: 'Add New Column',
			response: async (formData) => {
				if (formData) {
					await fetch(`/api/board/${data.board.id}/column`, {
						method: 'POST',
						body: JSON.stringify(formData),
					});
					await invalidateAll();
				}
			},
		};
		modalStore.trigger(form);
	};
</script>

<div class="flex gap-5 h-full overflow-x-auto overflow-y-auto p-8">
	<BoardColumn tasks={tasksWithNoColumn} options={false} />
	{#each data.board.columns as column}
		<BoardColumn {column} tasks={column.tasks} />
	{/each}
	<button
		on:click={openForm}
		class="flex items-center justify-center flex-shrink-0 flex-grow-0 w-72 h-full bg-surface-800 rounded-md btn cursor-pointer"
	>
		<h2 class="flex items-center justify-center text-surface-400 ">
			<span><IconPlus stroke={3} /></span>
			<span>New Column</span>
		</h2>
	</button>
</div>
