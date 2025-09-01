import { prisma } from "@/lib/prisma";

export async function GET() {
	const subs = await prisma.copyTradeSubscription.findMany({ orderBy: { createdAt: "desc" } });
	return Response.json({ ok: true, subscriptions: subs });
}

export async function POST(req: Request) {
	const { leaderStrategyId, followerUserId, scale } = await req.json();
	if (!leaderStrategyId) return new Response(JSON.stringify({ ok: false, error: "leaderStrategyId required" }), { status: 400 });
	const sub = await prisma.copyTradeSubscription.create({ data: { leaderStrategyId, followerUserId: followerUserId ?? null, scale: Number(scale ?? 1) } });
	return Response.json({ ok: true, subscription: sub });
}