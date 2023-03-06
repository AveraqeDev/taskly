import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Prisma } from '@prisma/client';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = await locals.validateUser();
	const { id: boardId, taskId } = params;

	if (!boardId || !taskId) {
		throw error(400, 'No ID supplied');
	}

	const board = await prisma.board.findFirstOrThrow({ where: { id: boardId } });
	if (board.userId !== user?.userId) {
		throw error(401, 'Unauthorized');
	}

	await prisma.task.delete({ where: { id: taskId } });

	return new Response(null, { status: 204 });
};

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const { user } = await locals.validateUser();
	const { id: boardId, taskId } = params;

	if (!boardId || !taskId) {
		throw error(400, 'No ID supplied');
	}

	const board = await prisma.board.findFirstOrThrow({ where: { id: boardId } });
	if (board.userId !== user?.userId) {
		throw error(401, 'Unauthorized');
	}

	const task = await prisma.task.findFirstOrThrow({ where: { id: taskId } });

	const { title, description, subtasks, columnId } = (await request.json()) as {
		title?: string;
		description?: string;
		subtasks?: string[];
		columnId?: string;
	};

	const subtasksData: Prisma.SubtaskUpdateManyWithoutParentTaskNestedInput | undefined = {};
	if (subtasks) {
		const existingSubtasks = await prisma.subtask.findMany({
			where: { parentTaskId: taskId },
		});

		const removedTasks = existingSubtasks.filter((sub) => !subtasks.includes(sub.title));
		const addedTasks = subtasks.filter(
			(sub) => !existingSubtasks.map((sub) => sub.title).includes(sub)
		);

		if (removedTasks.length) {
			subtasksData['disconnect'] = removedTasks.map((sub) => ({ id: sub.id }));
		}

		if (addedTasks.length) {
			subtasksData['createMany'] = { data: addedTasks.map((sub) => ({ title: sub })) };
		}
	}

	const columnData: Prisma.ColumnUpdateOneWithoutTasksNestedInput | undefined = {};
	if (columnId && task.columnId !== columnId) {
		columnData['connect'] = { id: columnId };
	}

	if (!columnId) {
		columnData['disconnect'] = true;
	}

	const updatedTask = await prisma.task.update({
		where: { id: taskId },
		data: {
			title,
			description,
			column: columnData,
			subtasks: subtasksData,
		},
	});

	return json(updatedTask);
};
