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

	await prisma.accountBalance.upsert({
		where: { id: "demo-balance" },
		create: { id: "demo-balance", userId: user.id, currency: "USD", balance: 10000 },
		update: {},
	});

	const wingZero = await prisma.strategy.upsert({
		where: { id: "wing-zero" },
		create: { id: "wing-zero", name: "Wing Zero", type: "WING_ZERO", isActive: false },
		update: {},
	});

	await prisma.sAWThreshold.createMany({
		data: [
			{ name: "MaxRiskPerTrade", value: 1, ownerId: user.id },
			{ name: "DailyLossLimit", value: 3, ownerId: user.id },
			{ name: "MinSignalStrength", value: 0.6, ownerId: user.id },
		],
	});

	await prisma.withdrawal.createMany({
		data: [
			{ amount: 50, note: "Coffee", ownerId: user.id },
			{ amount: 120, note: "Tools", ownerId: user.id },
		],
	});

	await prisma.aIConfig.upsert({
		where: { key: "ai.settings" },
		create: { key: "ai.settings", value: JSON.stringify({ sensitivity: 1, riskMultiplier: 1 }) },
		update: { value: JSON.stringify({ sensitivity: 1, riskMultiplier: 1 }) },
	});

	const project = await prisma.project.upsert({
		where: { id: "proj-1" },
		create: { id: "proj-1", name: "First Project", description: "Kickstart your powerful app", ownerId: user.id },
		update: {},
	});

	await prisma.task.createMany({
		data: [
			{ title: "Design schema", projectId: project.id, assigneeId: user.id },
			{ title: "Build UI", projectId: project.id, assigneeId: user.id },
			{ title: "Ship MVP", projectId: project.id, assigneeId: user.id },
		],
	});

	console.log("Seed complete", { user: user.email, strategy: wingZero.name });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});