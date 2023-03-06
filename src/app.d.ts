// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { PrismaClient, Role } from '@prisma/client';

// and what to do when importing types
declare global {
	declare namespace App {
		interface Locals {
			validate: import('@lucia-auth/sveltekit').Validate;
			validateUser: import('@lucia-auth/sveltekit').ValidateUser;
			setSession: import('@lucia-auth/sveltekit').SetSession;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
	// eslint-disable-next-line no-var
	var __prisma: PrismaClient;

	/// <reference types="lucia-auth" />
	declare namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type UserAttributes = {
			email: string;
			name: string;
			image?: string;
			role: Role;
		};
	}
}
