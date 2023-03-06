import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.validateUser();
	const boards = await prisma.board.findMany({
		where: { userId: user?.userId },
		include: { tasks: true },
	});
	return {
		boards,
	};
};
