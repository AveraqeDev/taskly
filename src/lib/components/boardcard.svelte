<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { ListBox, ListBoxItem, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { IconDotsVertical, IconEdit, IconTrashX } from '@tabler/icons-svelte';
	import { fade } from 'svelte/transition';
	import type { Board, Task } from '@prisma/client';
	import Boardform from './boardform.svelte';

	export let board: Board & { tasks: Task[] };

	let menuOpen: boolean = false;

	const handleDelete = async (e: MouseEvent) => {
		await fetch(`/api/board/${board.id}`, { method: 'DELETE' });
		await invalidateAll();
		menuOpen = false;
	};

	const handleEdit = async (e: MouseEvent) => {
		openForm();
		menuOpen = false;
	};

	const openForm = (): void => {
		const form: ModalSettings = {
			type: 'component',
			component: { ref: Boardform, props: { board } },
			title: 'Edit Board',
			response: async (formData) => {
				if (formData) {
					await fetch(`/api/board/${board.id}`, {
						method: 'PATCH',
						body: JSON.stringify(formData),
					});
					await invalidateAll();
				}
			},
		};
		modalStore.trigger(form);
	};
</script>

<div
	style={`background-color: ${board.color}`}
	class="card card-hover p-4 h-24 cursor-pointer rounded-sm flex justify-between"
>
	<a href={`/board/${board.slug}`} class="flex flex-col unstyled w-full h-full">
		<strong>{board.name}</strong>
		<span class="text-surface-500 text-xs">{board.tasks.length} Task(s)</span>
	</a>
	<span class="relative">
		<button
			class="btn-icon -mt-2 -mr-2"
			on:click={(e) => {
				e.preventDefault();
				menuOpen = !menuOpen;
			}}
		>
			<span>
				<IconDotsVertical />
			</span>
		</button>
		{#if menuOpen}
			<div
				transition:fade={{ duration: 150 }}
				class="absolute right-0 card rounded-md w-48 shadow-xl"
			>
				<ListBox>
					<button on:click={handleEdit} class="w-full text-left">
						<ListBoxItem>
							<svelte:fragment slot="lead">
								<IconEdit />
							</svelte:fragment>
							<span>Edit</span>
						</ListBoxItem>
					</button>
					<button on:click={handleDelete} class="w-full text-left">
						<ListBoxItem>
							<svelte:fragment slot="lead">
								<IconTrashX />
							</svelte:fragment>
							<span>Delete</span>
						</ListBoxItem>
					</button>
				</ListBox>
			</div>
		{/if}
	</span>
</div>
