<script lang="ts">
	import { page } from '$app/stores';
	import type { Subtask, Task } from '@prisma/client';
	import { fade } from 'svelte/transition';
	import { ListBox, ListBoxItem, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { IconDotsVertical, IconEdit, IconTrashX } from '@tabler/icons-svelte';
	import SubtaskCard from '$lib/components/subtaskcard.svelte';
	import { invalidateAll } from '$app/navigation';
	import TaskForm from './taskform.svelte';

	export let task: Task & { subtasks: Subtask[] };
	export let parent: any;

	let menuOpen: boolean = false;

	let doneSubtasks = task.subtasks.filter((sub) => sub.done);

	const handleDelete = async (e: MouseEvent) => {
		await fetch(`/api/board/${$page.data.board.id}/task/${task.id}`, { method: 'DELETE' });
		await invalidateAll();
		parent.onClose();
	};

	const handleEdit = (e: MouseEvent): void => {
		const form: ModalSettings = {
			type: 'component',
			component: { ref: TaskForm, props: { task } },
			title: 'Edit Task',
			response: async (formData) => {
				if (formData) {
					await fetch(`/api/board/${$page.data.board.id}/task/${task.id}`, {
						method: 'PATCH',
						body: JSON.stringify(formData),
					});
					await invalidateAll();
				}
			},
		};
		modalStore.close();
		modalStore.trigger(form);
	};

	const handleStatusChange = async (e: Event) => {
		await fetch(`/api/board/${$page.data.board.id}/task/${task.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ columnId: task.columnId }),
		});
		await invalidateAll();
	};
</script>

<div class="flex flex-col gap-8 p-4">
	<div class="flex items-center justify-between">
		<h3>{task.title}</h3>
		<span class="relative">
			<button class="btn-icon" on:click={() => (menuOpen = !menuOpen)}>
				<span>
					<IconDotsVertical size={30} />
				</span>
			</button>
			{#if menuOpen}
				<div
					transition:fade={{ duration: 150 }}
					class="absolute right-0 top-14 card rounded-md w-48 shadow-xl"
				>
					<ListBox>
						<button class="text-left w-full" on:click={handleEdit}>
							<ListBoxItem>
								<svelte:fragment slot="lead">
									<IconEdit />
								</svelte:fragment>
								Edit
							</ListBoxItem>
						</button>
						<button class="text-left w-full" on:click={handleDelete}>
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
	</div>

	<span class="text-surface-400">{task.description}</span>

	<div class="flex flex-col gap-4">
		<p class="text-lg">Subtasks ({doneSubtasks.length} of {task.subtasks.length})</p>
		{#each task.subtasks as subtask}
			<SubtaskCard {subtask} />
		{/each}
	</div>

	<label class="label space-y-4">
		<span>Status</span>
		<select
			class="select rounded-sm cursor-pointer"
			bind:value={task.columnId}
			on:change={handleStatusChange}
		>
			<option value={null}>Backlog</option>
			{#each $page.data.board.columns as column}
				<option value={column.id}>{column.name}</option>
			{/each}
		</select>
	</label>

	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
			{parent.buttonTextCancel}
		</button>
	</footer>
</div>
