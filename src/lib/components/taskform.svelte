<script lang="ts">
	import { page } from '$app/stores';
	import type { Subtask, Task } from '@prisma/client';
	import { modalStore } from '@skeletonlabs/skeleton';
	import { IconPlus, IconX } from '@tabler/icons-svelte';

	export let task: (Task & { subtasks: Subtask[] }) | null = null;
	export let parent: any;

	const formData = {
		title: task?.title || '',
		description: task?.description || '',
		subtasks: task?.subtasks.map((sub) => sub.title) || [],
		columnId: task?.columnId || '',
	};

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}
</script>

<div class="space-y-4 p-4">
	<form class="p-4 space-y-4 rounded-container-token">
		<label class="label">
			<span>Title</span>
			<input
				class="input rounded-sm"
				type="text"
				bind:value={formData.title}
				placeholder="e.g Take coffee break"
			/>
		</label>
		<label class="label">
			<span>Description</span>
			<textarea
				class="textarea rounded-sm"
				bind:value={formData.description}
				rows="4"
				placeholder="e.g It's always good to take a break. This 15 minute break will help recharge the batteries a little."
			/>
		</label>
		<label class="label flex flex-col gap-2">
			<span>Subtasks</span>
			{#each formData.subtasks as subtask, i}
				<div class="input-group input-group-divider grid-cols-[1fr_auto]">
					<input type="text" placeholder="e.g Make coffee" bind:value={subtask} />
					<button
						class="btn variant-filled-error"
						on:click={() => {
							formData.subtasks.splice(i, 1);
							formData.subtasks = formData.subtasks;
						}}
					>
						<IconX />
					</button>
				</div>
			{/each}
			<button
				on:click={() => {
					formData.subtasks.push('');
					formData.subtasks = formData.subtasks;
				}}
				class="btn variant-soft-primary w-full"
			>
				<span><IconPlus /></span>
				Add New Subtask
			</button>
		</label>
		<label class="label">
			<span>Status</span>
			<select class="select rounded-sm cursor-pointer" bind:value={formData.columnId}>
				<option value="">Backlog</option>
				{#each $page.data.board.columns as column}
					<option value={column.id}>{column.name}</option>
				{/each}
			</select>
		</label>
	</form>

	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
			{parent.buttonTextCancel}
		</button>
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>
			{#if task}Save{:else}Create{/if}
		</button>
	</footer>
</div>
