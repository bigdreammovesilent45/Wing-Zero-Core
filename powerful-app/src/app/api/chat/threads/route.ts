import { prisma } from "@/lib/prisma";

export async function GET() {
	const threads = await prisma.chatThread.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });
	return Response.json({ ok: true, threads });
}

export async function POST(req: Request) {
	const { title } = await req.json().catch(() => ({ title: null }));
	const thread = await prisma.chatThread.create({ data: { title: title ?? "New Thread" } });
	return Response.json({ ok: true, thread });
}