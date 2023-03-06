/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from '$lib/server/providers/request';
import type { Auth, LuciaError } from 'lucia-auth';
import {
	type CreateUserAttributesParameter,
	generateState,
	type GetAuthorizationUrlReturnType,
	type LuciaUser,
	type OAuthConfig,
	type OAuthProvider,
	LuciaOAuthError,
} from '@lucia-auth/oauth';

interface Configs extends OAuthConfig {
	redirectUri: string;
}

class Discord<A extends Auth> implements OAuthProvider<A> {
	constructor(auth: A, configs: Configs) {
		this.auth = auth;
		this.clientId = configs.clientId;
		this.clientSecret = configs.clientSecret;
		this.redirectUri = configs.redirectUri;
		this.scope = configs.scope ?? [];
	}
	private auth: A;
	private clientId: string;
	private clientSecret: string;
	private scope: string[];
	private redirectUri: string;

	public getAuthorizationUrl = <State extends string | null | undefined = undefined>(
		state?: State
	): GetAuthorizationUrlReturnType<State> => {
		const s = state ?? (typeof state === 'undefined' ? generateState() : undefined);
		const url = `https://discord.com/oauth2/authorize?${new URLSearchParams({
			response_type: 'code',
			client_id: this.clientId,
			scope: this.scope.join(' '),
			redirect_uri: this.redirectUri,
			...(s && { state: s }),
		}).toString()}`;
		if (state === null) {
			return [url] as const as GetAuthorizationUrlReturnType<State>;
		}
		return [url, s] as const as GetAuthorizationUrlReturnType<State>;
	};

	public validateCallback = async (code: string) => {
		const response = await fetch('https://discord.com/api/oauth2/token', {
			method: 'POST',
			body: new URLSearchParams({
				client_id: this.clientId,
				client_secret: this.clientSecret,
				code,
				grant_type: 'authorization_code',
				redirect_uri: this.redirectUri,
			}).toString(),
			headers: {
				'User-Agent': 'lucia',
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		if (!response.ok) {
			if (this.auth.ENV === 'DEV') {
				try {
					console.log(response.status, await response.json());
				} catch {
					console.log(response.status);
				}
			}
			throw new LuciaOAuthError('REQUEST_FAILED');
		}

		const {
			access_token: accessToken,
			refresh_token: refreshToken,
			expires_in: expiresIn,
		} = (await response.json()) as {
			access_token: string;
			refresh_token: string;
			token_type: string;
			expires_in: number;
			scope: string;
		};

		const discordUser = (await get('https://discord.com/api/users/@me', {
			env: this.auth.ENV,
			bearerToken: accessToken,
		})) as DiscordUser;

		if (discordUser.avatar === null) {
			const defaultAvatarNumber = parseInt(discordUser.discriminator) % 5;
			discordUser.avatar = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
		} else {
			const format = discordUser.avatar.startsWith('a_') ? 'gif' : 'png';
			discordUser.avatar = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${format}`;
		}

		const PROVIDER_ID = 'discord';
		const PROVIDER_USER_ID = discordUser.id;
		let existingUser: LuciaUser<A> | null = null;
		try {
			const { user } = await this.auth.getKeyUser(PROVIDER_ID, PROVIDER_USER_ID);
			existingUser = user as LuciaUser<A>;
		} catch (e) {
			const error = e as Partial<LuciaError>;
			if (error?.message !== 'AUTH_INVALID_KEY_ID') throw e;
			// existingUser is null
		}

		const createUser = async (userAttributes: CreateUserAttributesParameter<A>) => {
			return (await this.auth.createUser({
				key: {
					providerId: PROVIDER_ID,
					providerUserId: PROVIDER_USER_ID,
				},
				attributes: userAttributes as any,
			})) as any;
		};
		const createKey = async (userId: string) => {
			return await this.auth.createKey(userId, {
				providerId: PROVIDER_ID,
				providerUserId: PROVIDER_USER_ID,
				password: null,
			});
		};
		return {
			createUser,
			existingUser,
			providerUser: discordUser,
			createKey,
			accessToken,
			refreshToken,
			expiresIn,
		};
	};
}

const discord = <A extends Auth>(auth: A, configs: Configs) => {
	return new Discord(auth, configs);
};

export default discord;

interface DiscordUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null;
	bot?: boolean;
	system?: boolean;
	mfa_enabled: boolean;
	banner: string | null;
	accent_color: number | null;
	locale: string;
	verified: boolean;
	email: string | null;
	flags: number;
	premium_type: number;
	public_flags: number;
	display_name: string | null;
	avatar_decoration: string | null;
	banner_color: string | null;
	image_url: string;
}
