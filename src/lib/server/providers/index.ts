import discord from '$lib/server/providers/discord';
import { auth } from '$lib/server/lucia';
import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI,
} from '$env/static/private';

const discordAuth = discord(auth, {
	clientSecret: DISCORD_CLIENT_SECRET,
	clientId: DISCORD_CLIENT_ID,
	redirectUri: DISCORD_REDIRECT_URI,
	scope: ['identify', 'email'],
});

export const ALL_PROVIDERS = {
	discord: discordAuth,
} as const;

export type Provider = keyof typeof ALL_PROVIDERS;
