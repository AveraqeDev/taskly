import type { PageServerLoad } from './$types';
import { ALL_PROVIDERS } from '$lib/server/providers';

export const load: PageServerLoad = async () => {
	const providers = Object.keys(ALL_PROVIDERS);
	return {
		providers,
	};
};
