<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
	import Appbar from '$lib/components/appbar.svelte';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<Appbar dashboard={true} />
	</svelte:fragment>
	<main class="max-w-7xl mx-auto p-4 sm:p-2">
		<slot />
	</main>
</AppShell>
