import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	const { user } = await locals.validateUser();
	const { id } = params;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	if (!id) {
		throw error(400, 'No ID supplied');
	}

	const { name, color } = (await request.json()) as {
		name: string;
		color: string;
	};

	const newColumn = await prisma.column.create({
		data: { name, color, boardId: id },
	});

	return json(newColumn, { status: 201 });
};
