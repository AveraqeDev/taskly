<script lang="ts">
	import type { LayoutData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import {
		AppRail,
		AppShell,
		ListBox,
		ListBoxItem,
		modalStore,
		type ModalSettings,
	} from '@skeletonlabs/skeleton';
	import { IconListCheck, IconPlus, IconLayoutBoardSplit } from '@tabler/icons-svelte';
	import Appbar from '$lib/components/appbar.svelte';
	import Boardform from '$lib/components/boardform.svelte';

	export let data: LayoutData;

	const openForm = (e: MouseEvent): void => {
		const form: ModalSettings = {
			type: 'component',
			component: { ref: Boardform },
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

<AppShell>
	<svelte:fragment slot="pageHeader">
		<Appbar title={data.board.name} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<AppRail width="w-60 overflow-hidden">
			<svelte:fragment slot="lead">
				<div class="p-2">
					<a href="/dashboard" class="btn flex justify-start items-center">
						<IconListCheck class="text-primary-500" stroke={3} size={32} />
						<span class="text-3xl font-bold text-primary-500">taskly</span>
					</a>
				</div>
			</svelte:fragment>
			<div class="mt-5 overflow-y-auto">
				<span class="p-5 inline-block text-surface-400 font-bold text-sm">
					ALL BOARDS ({data.allBoards.length})
				</span>
				<ListBox>
					{#each data.allBoards as board}
						<a href={`/board/${board.slug}`} class="unstyled">
							<ListBoxItem>
								<svelte:fragment slot="lead"><IconLayoutBoardSplit /></svelte:fragment>
								<span class="flex gap-5 items-center">
									{board.name}
									<span
										class="badge rounded-full w-4 h-4"
										style={`background-color: ${board.color}`}
									/>
								</span>
							</ListBoxItem>
						</a>
					{/each}
					<button class="w-full text-left text-primary-500" on:click={openForm}>
						<ListBoxItem>
							<svelte:fragment slot="lead">
								<IconPlus />
							</svelte:fragment>
							Create New Board
						</ListBoxItem>
					</button>
				</ListBox>
			</div>
		</AppRail>
	</svelte:fragment>
	<slot />
</AppShell>
