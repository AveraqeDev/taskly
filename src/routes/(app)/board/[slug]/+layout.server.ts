import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { user } = await locals.validateUser();
	const { slug } = params;
	const board = await prisma.board.findFirstOrThrow({
		where: { slug },
		include: {
			columns: {
				include: {
					tasks: {
						include: {
							subtasks: true,
						},
					},
				},
			},
			tasks: {
				include: {
					subtasks: true,
				},
			},
		},
	});
	if (board.userId !== user?.userId) {
		throw redirect(302, '/dashboard');
	}
	const allBoards = await prisma.board.findMany({ where: { userId: user?.userId } });
	return {
		allBoards,
		board,
	};
};
