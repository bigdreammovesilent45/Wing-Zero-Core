import { prisma } from "@/lib/prisma";

export async function GET() {
	const rows = await prisma.bioMetric.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
	return Response.json({ ok: true, metrics: rows });
}