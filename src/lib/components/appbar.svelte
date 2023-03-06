<script lang="ts">
	import { page } from '$app/stores';
	import { Role } from '@prisma/client';
	import { fade } from 'svelte/transition';
	import {
		AppBar,
		Avatar,
		ListBox,
		ListBoxItem,
		modalStore,
		type ModalSettings,
	} from '@skeletonlabs/skeleton';
	import {
		IconPlus,
		IconDotsVertical,
		IconUserCircle,
		IconSettings,
		IconLogout,
		IconListCheck,
	} from '@tabler/icons-svelte';
	import { invalidateAll } from '$app/navigation';
	import Boardform from '$lib/components/boardform.svelte';
	import Taskform from '$lib/components/taskform.svelte';

	let menuOpen: boolean = false;

	let menuItems: {
		name: string;
		href: string;
		icon: ConstructorOfATypedSvelteComponent;
	}[] = [
		{
			name: 'Profile',
			href: '/profile',
			icon: IconUserCircle,
		},
		{
			name: 'Settings',
			href: '/settings',
			icon: IconSettings,
		},
	];

	export let title: string | null = null;
	export let dashboard: boolean = false;

	const openForm = (e: MouseEvent): void => {
		const form: ModalSettings = {
			type: 'component',
			component: { ref: dashboard ? Boardform : Taskform },
			title: `Add New ${dashboard ? 'Board' : 'Task'}`,
			response: async (formData) => {
				if (formData) {
					const path = dashboard ? '/api/board' : `/api/board/${$page.data.board.id}/task`;
					await fetch(path, {
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

<AppBar>
	<svelte:fragment slot="lead">
		{#if title}
			<h2>{title}</h2>
		{:else}
			<a href="/dashboard" class="btn flex justify-start items-center py-0">
				<IconListCheck class="text-primary-500" stroke={3} size={32} />
				<span class="text-3xl font-bold text-primary-500">taskly</span>
			</a>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div class="flex items-center justify-center gap-3">
			<button on:click={openForm} class="btn btn-base variant-filled-primary rounded-full">
				<span><IconPlus /></span>
				<span>
					Add New {#if dashboard}Board{:else}Task{/if}
				</span>
			</button>
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
							<div class="p-2 flex items-center justify-center gap-2">
								<Avatar
									src={$page.data._lucia?.user?.image}
									initials={$page.data._lucia?.user?.name}
									width="w-24"
								/>
								<div>
									<strong class="text-sm">{$page.data._lucia?.user?.name}</strong>
									<span class="text-xs text-surface-500">{$page.data._lucia?.user?.email}</span>
									{#if $page.data._lucia?.user?.role !== Role.FREE}
										<span
											class={`badge variant-filled-${$page.data._lucia?.user?.role.toLowerCase()} rounded-md`}
											>{$page.data._lucia?.user?.role}</span
										>
									{/if}
								</div>
							</div>
							<hr class="bg-surface-500" />
							{#each menuItems as item}
								<a href={item.href} on:click={() => (menuOpen = false)}>
									<ListBoxItem>
										<svelte:fragment slot="lead">
											<svelte:component this={item.icon} />
										</svelte:fragment>
										{item.name}
									</ListBoxItem>
								</a>
							{/each}
							<hr class="bg-surface-500" />

							<form method="POST">
								<button
									formaction="/auth/logout"
									type="submit"
									class="w-full listbox-item flex items-center space-x-4 whitespace-nowrap cursor-pointer -outline-offset-[3px] px-4 py-3 rounded-token bg-primary-hover-token"
								>
									<span><IconLogout /></span>
									<span>Logout</span>
								</button>
							</form>
						</ListBox>
					</div>
				{/if}
			</span>
		</div>
	</svelte:fragment>
</AppBar>
