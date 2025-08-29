import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	const email = "demo@example.com";
	const passwordHash = await bcrypt.hash("password123", 10);

	const user = await prisma.user.upsert({
		where: { email },
		create: { email, name: "Demo User", passwordHash },
		update: {},
	});

	const project = await prisma.project.create({
		data: {
			name: "First Project",
			description: "Kickstart your powerful app",
			ownerId: user.id,
		},
	});

	await prisma.task.createMany({
		data: [
			{ title: "Design schema", projectId: project.id, assigneeId: user.id },
			{ title: "Build UI", projectId: project.id, assigneeId: user.id },
			{ title: "Ship MVP", projectId: project.id, assigneeId: user.id },
		],
	});

	console.log("Seed complete: ", { user: user.email, project: project.name });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});