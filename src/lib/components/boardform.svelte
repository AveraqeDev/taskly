<script lang="ts">
	import type { Board } from '@prisma/client';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let board: Board | null = null;
	export let parent: any;

	const formData = {
		name: board?.name || '',
		color: board?.color || '',
		public: board === null ? false : board.public,
	};

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}
</script>

<div class="space-y-4 p-4">
	<form class="p-4 space-y-4 rounded-container-token">
		<label class="label">
			<span>Name</span>
			<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
		</label>
		<label class="label">
			<span>Color</span>
			<div class="grid grid-cols-[auto_1fr] gap-2">
				<input class="input" type="color" bind:value={formData.color} />
				<input class="input" type="text" bind:value={formData.color} readonly tabindex="-1" />
			</div>
		</label>
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={formData.public} />
			<p>Public?</p>
		</label>
	</form>

	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
			{parent.buttonTextCancel}
		</button>
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>
			{#if board}Save{:else}Create{/if}
		</button>
	</footer>
</div>
