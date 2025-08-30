import { prisma } from "@/lib/prisma";

export async function GET() {
	const rows = await prisma.copyTradeExecution.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
	const byStrategy = new Map<string, { pnl: number; wins: number; losses: number }>();
	for (const r of rows) {
		const s = byStrategy.get(r.leaderStrategyId) ?? { pnl: 0, wins: 0, losses: 0 };
		s.pnl += r.pnl ?? 0;
		if (r.win) s.wins++; else s.losses++;
		byStrategy.set(r.leaderStrategyId, s);
	}
	const performance = Array.from(byStrategy.entries()).map(([strategyId, stats]) => ({ strategyId, ...stats }));
	return Response.json({ ok: true, performance });
}