import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Prisma } from '@prisma/client';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	const { user } = await locals.validateUser();
	const { id } = params;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	if (!id) {
		throw error(400, 'No ID supplied');
	}

	const board = await prisma.board.findFirstOrThrow({ where: { id } });

	if (board.userId !== user.userId) {
		throw error(401, 'Unauthorized');
	}

	const { title, description, subtasks, columnId } = (await request.json()) as {
		title: string;
		description: string;
		subtasks: string[];
		columnId: string;
	};

	const data:
		| (Prisma.Without<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput> &
				Prisma.TaskUncheckedCreateInput)
		| (Prisma.Without<Prisma.TaskUncheckedCreateInput, Prisma.TaskCreateInput> &
				Prisma.TaskCreateInput) = {
		title,
		description,
		subtasks: { createMany: { data: subtasks.map((sub) => ({ title: sub })) } },
		board: {
			connect: {
				id,
			},
		},
	};

	if (columnId) {
		data['column'] = { connect: { id: columnId } };
	}

	const newTask = await prisma.task.create({
		data,
	});

	return json(newTask, { status: 201 });
};
