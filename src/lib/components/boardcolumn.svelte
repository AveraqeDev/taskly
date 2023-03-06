<script lang="ts">
	import type { Column, Subtask, Task } from '@prisma/client';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { ListBox, ListBoxItem, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { IconDotsVertical, IconEdit, IconTrashX } from '@tabler/icons-svelte';
	import ColumnForm from '$lib/components/columnform.svelte';
	import TaskCard from '$lib/components/taskcard.svelte';

	export let column: (Column & { tasks: (Task & { subtasks: Subtask[] })[] }) | null = null;
	export let tasks: (Task & { subtasks: Subtask[] })[];
	export let options: boolean = true;

	let menuOpen: boolean = false;

	const openForm = (_: MouseEvent) => {
		const form: ModalSettings = {
			type: 'component',
			component: { ref: ColumnForm, props: { column } },
			title: 'Edit Board',
			response: async (formData) => {
				if (formData) {
					await fetch(`/api/board/${$page.data.board.id}/column/${column?.id}`, {
						method: 'PATCH',
						body: JSON.stringify(formData),
					});
					await invalidateAll();
				}
			},
		};
		modalStore.trigger(form);
		menuOpen = false;
	};

	const handleDelete = async (_: MouseEvent) => {
		await fetch(`/api/board/${$page.data.board.id}/column/${column?.id}`, {
			method: 'DELETE',
		});
		await invalidateAll();
		menuOpen = false;
	};
</script>

<div
	class="flex flex-col gap-5 flex-shrink-0 flex-grow-0 w-72 h-full overflow-x-hidden overflow-y-auto relative"
>
	<div class="flex items-center justify-between min-h-[2.69rem]">
		<div class="flex items-center gap-2 sticky top-0">
			<span
				class="badge rounded-full w-4 h-4"
				style={`background-color: ${column ? column.color : '#939EAE'}`}
			/>
			<span class="text-md font-bold text-surface-400">
				{column ? column.name.toUpperCase() : 'BACKLOG'} ({tasks.length})
			</span>
		</div>
		{#if options}
			<span class="relative">
				<button class="btn-icon" on:click={() => (menuOpen = !menuOpen)}>
					<span>
						<IconDotsVertical />
					</span>
				</button>
				{#if menuOpen}
					<div
						transition:fade={{ duration: 150 }}
						class="absolute right-0 top-14 card rounded-md w-48 shadow-xl"
					>
						<ListBox>
							<button on:click={openForm} class="text-left w-full">
								<ListBoxItem>
									<svelte:fragment slot="lead">
										<IconEdit />
									</svelte:fragment>
									Edit
								</ListBoxItem>
							</button>
							<button on:click={handleDelete} class="text-left w-full">
								<ListBoxItem>
									<svelte:fragment slot="lead">
										<IconTrashX />
									</svelte:fragment>
									Delete
								</ListBoxItem>
							</button>
						</ListBox>
					</div>
				{/if}
			</span>
		{/if}
	</div>
	{#each tasks as task}
		<TaskCard {task} />
	{/each}
</div>
