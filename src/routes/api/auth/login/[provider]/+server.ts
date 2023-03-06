import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { ALL_PROVIDERS, type Provider } from '$lib/server/providers';

export const GET: RequestHandler = async ({ params, cookies }) => {
	if (params.provider) {
		const providerAuth = ALL_PROVIDERS[params.provider as Provider];

		const [authUrl, state] = providerAuth.getAuthorizationUrl();

		cookies.set('taskly-oauth-state', state || '', {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60,
		});

		throw redirect(302, authUrl);
	}
	throw error(400, 'Provider not supplied');
};
