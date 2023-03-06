<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import type { Subtask } from '@prisma/client';

	export let subtask: Subtask;

	const handleChange = async (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		await fetch(
			`/api/board/${$page.data.board.id}/task/${subtask.parentTaskId}/subtask/${subtask.id}`,
			{
				method: 'PATCH',
				body: JSON.stringify({ done: e.currentTarget.checked }),
			}
		);
		await invalidateAll();
	};
</script>

<div class="flex items-center gap-4 p-4 bg-surface-900 rounded-md">
	<label class="label">
		<span class="sr-only">Done</span>
		<input type="checkbox" class="checkbox" bind:checked={subtask.done} on:change={handleChange} />
	</label>
	<span class={`text-lg ${subtask.done && 'line-through text-surface-500'}`}>{subtask.title}</span>
</div>
