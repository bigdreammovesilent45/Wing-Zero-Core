import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const take = Number(url.searchParams.get("take") ?? 20);
	const rows = await prisma.aIInsight.findMany({ orderBy: { createdAt: "desc" }, take: Math.min(take, 100) });
	return Response.json({ ok: true, insights: rows });
}