import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = await locals.validateUser();
	const { id: boardId, columnId } = params;

	if (!boardId || !columnId) {
		throw error(400, 'No ID supplied');
	}

	const board = await prisma.board.findFirstOrThrow({ where: { id: boardId } });
	if (board.userId !== user?.userId) {
		throw error(401, 'Unauthorized');
	}

	await prisma.column.delete({ where: { id: columnId } });

	return new Response(null, { status: 204 });
};

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const { user } = await locals.validateUser();
	const { id: boardId, columnId } = params;
	const { name, color } = (await request.json()) as { name: string; color: string };

	if (!boardId || !columnId) {
		throw error(400, 'No ID supplied');
	}

	const board = await prisma.board.findFirstOrThrow({ where: { id: boardId } });
	if (board.userId !== user?.userId) {
		throw error(401, 'Unauthorized');
	}

	const updatedColumn = await prisma.column.update({
		where: { id: columnId },
		data: { name, color },
	});

	return json(updatedColumn);
};
