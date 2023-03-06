import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = await locals.validateUser();
	const { id } = params;

	if (!id) {
		throw error(400, 'No ID supplied');
	}

	const board = await prisma.board.findFirstOrThrow({ where: { id } });
	if (board.userId !== user?.userId) {
		throw error(401, 'Unauthorized');
	}

	await prisma.board.delete({ where: { id } });

	return new Response(null, { status: 204 });
};

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const { user } = await locals.validateUser();
	const { id } = params;
	const {
		name,
		color,
		public: publicBoard,
	} = (await request.json()) as { name: string; color: string; public: boolean };

	if (!id) {
		throw error(400, 'No ID supplied');
	}

	const board = await prisma.board.findFirstOrThrow({ where: { id } });
	if (board.userId !== user?.userId) {
		throw error(401, 'Unauthorized');
	}

	const updatedBoard = await prisma.board.update({
		where: { id },
		data: { name, color, public: publicBoard },
	});

	return json(updatedBoard);
};
