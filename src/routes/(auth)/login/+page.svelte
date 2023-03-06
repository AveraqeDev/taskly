<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const capitalizeFirstLetter = (str: string): string => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
</script>

<div class="flex items-center justify-center">
	<div
		class="card p-4 flex flex-col items-center justify-center gap-2 rounded-md divide-y-2 divide-surface-500"
	>
		<header class="card-header text-center">
			<h1>Login</h1>
			<p class="pt-2 text-surface-400">Sign in with your favorite provider below</p>
		</header>
		<div class="p-4 flex flex-col gap-2 items-center justify-center">
			{#each data.providers as provider}
				<a href={`/api/auth/login/${provider}`} class="btn variant-filled-primary w-full">
					<span>Sign In With {capitalizeFirstLetter(provider)}</span>
				</a>
			{/each}
		</div>
	</div>
</div>
