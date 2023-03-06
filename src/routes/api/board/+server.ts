import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { slugify } from '$lib/slugify';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = await locals.validateUser();

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const {
		name,
		color,
		public: boardPublic,
	} = (await request.json()) as {
		name: string;
		color?: string;
		public: boolean;
	};

	let slugUnique = true;
	let slug = slugify(name);
	let number = 1;

	do {
		const slugExists = await prisma.board.findUnique({ where: { slug } });
		if (slugExists) {
			slugUnique = false;
			slug = slugify(name, `${number}`);
			number += 1;
		} else {
			slugUnique = true;
		}
	} while (!slugUnique);

	const newBoard = await prisma.board.create({
		data: { name, slug, color, public: boardPublic, userId: user.userId },
	});

	return json(newBoard, { status: 201 });
};
