<script lang="ts">
	import type { Subtask, Task } from '@prisma/client';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import TaskDetails from './taskdetails.svelte';

	export let task: Task & { subtasks: Subtask[] };

	const openDetails = (e: MouseEvent): void => {
		const modal: ModalSettings = {
			type: 'component',
			component: { ref: TaskDetails, props: { task } },
			buttonTextCancel: 'Close',
		};
		modalStore.trigger(modal);
	};
</script>

<button
	on:click={openDetails}
	class="card card-hover cursor-pointer p-4 py-6 w-full rounded-md flex flex-col gap-2 btn text-left items-start whitespace-normal"
>
	<strong>
		{task.title}
	</strong>
	<span class="text-xs text-surface-500">
		{task.subtasks.filter((sub) => sub.done).length} of {task.subtasks.length} subtasks
	</span>
</button>
