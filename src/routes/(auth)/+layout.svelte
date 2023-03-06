<script lang="ts">
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { IconListCheck } from '@tabler/icons-svelte';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<div class="w-full flex items-center justify-center">
				<span class="flex justify-start items-center">
					<IconListCheck class="text-primary-500" stroke={3} size={30} />
					<span class="text-3xl font-bold text-primary-500">taskly</span>
				</span>
			</div>
		</AppBar>
	</svelte:fragment>
	<main class="mt-48">
		<slot />
	</main>
</AppShell>
