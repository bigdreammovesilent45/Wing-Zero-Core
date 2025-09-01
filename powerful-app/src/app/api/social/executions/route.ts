import { prisma } from "@/lib/prisma";

export async function GET() {
	const rows = await prisma.copyTradeExecution.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
	return Response.json({ ok: true, executions: rows });
}