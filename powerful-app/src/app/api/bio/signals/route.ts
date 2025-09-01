import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const take = Number(url.searchParams.get("take") ?? 50);
	const rows = await prisma.bioSignal.findMany({ orderBy: { createdAt: "desc" }, take: Math.min(take, 200) });
	return Response.json({ ok: true, signals: rows });
}