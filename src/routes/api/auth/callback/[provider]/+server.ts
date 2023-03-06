import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { Role } from '@prisma/client';
import { ALL_PROVIDERS, type Provider } from '$lib/server/providers';
import { auth } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ url, cookies, params }) => {
	if (!params.provider) {
		throw error(400, 'Provider not supplied');
	}

	const providerAuth = ALL_PROVIDERS[params.provider as Provider];
	const reqUrl = new URL(url);
	const code = reqUrl.searchParams.get('code');
	const state = reqUrl.searchParams.get('state');

	const storedState = cookies.get('taskly-oauth-state');

	if (state !== storedState) throw new Error('Invalid state');

	const { existingUser, providerUser, createUser } = await providerAuth.validateCallback(
		code || ''
	);
	const user =
		existingUser ??
		(await createUser({
			email: providerUser.email || '',
			name: providerUser.username,
			image: providerUser.avatar || undefined,
			role: Role.FREE,
		}));
	const session = await auth.createSession(user.userId);
	const sessionCookies = auth.createSessionCookies(session);
	for (const cookie of sessionCookies) {
		cookies.set(cookie.name, cookie.value, cookie.attributes);
	}

	throw redirect(302, '/dashboard');
};
