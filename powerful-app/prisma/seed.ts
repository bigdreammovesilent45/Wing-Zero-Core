import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedPriceBars() {
	const symbols = [
		{ symbol: "EURUSD", start: 1.1 },
		{ symbol: "BTCUSD", start: 60000 },
	];
	const timeframe = "1m";
	const minutes = 300; // last 300 minutes
	const now = new Date();
	for (const { symbol, start } of symbols) {
		let price = start;
		for (let m = minutes; m >= 0; m--) {
			const time = new Date(now.getTime() - m * 60_000);
			const drift = (Math.random() - 0.5) * (symbol === "EURUSD" ? 0.0006 : 60);
			const open = price;
			price = Math.max(0.0001, price + drift);
			const high = Math.max(open, price) + Math.abs(drift) * 0.2;
			const low = Math.min(open, price) - Math.abs(drift) * 0.2;
			const close = price;
			try {
				await prisma.priceBar.upsert({
					where: { symbol_timeframe_time: { symbol, timeframe, time } },
					create: { symbol, timeframe, time, open, high, low, close, volume: Math.random() * 1000 },
					update: { open, high, low, close },
				});
			} catch {
				// ignore
			}
		}
	}
}

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

	await seedPriceBars();

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