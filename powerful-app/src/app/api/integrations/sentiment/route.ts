import { prisma } from "@/lib/prisma";

export async function GET() {
	const rows = await prisma.aIInsight.findMany({ where: { kind: "sentiment" }, orderBy: { createdAt: "desc" }, take: 200 });
	const bySymbol = new Map<string, number[]>();
	for (const r of rows) {
		if (!r.symbol) continue;
		const arr = bySymbol.get(r.symbol) ?? [];
		arr.push(r.score ?? 0);
		bySymbol.set(r.symbol, arr);
	}
	const sentiments = Array.from(bySymbol.entries()).map(([symbol, scores]) => ({ symbol, avg: scores.reduce((a, b) => a + b, 0) / scores.length }));
	return Response.json({ ok: true, sentiments });
}