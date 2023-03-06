import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const { user } = await locals.validateUser();
	const { id: boardId, taskId, subtaskId } = params;
	const data = (await request.json()) as { title?: string; done?: boolean };

	if (!boardId || !taskId || !subtaskId) {
		throw error(400, 'No ID supplied');
	}

	const board = await prisma.board.findFirstOrThrow({ where: { id: boardId } });
	if (board.userId !== user?.userId) {
		throw error(401, 'Unauthorized');
	}

	const updatedSubtask = await prisma.subtask.update({
		where: { id: subtaskId },
		data,
	});

	return json(updatedSubtask);
};
