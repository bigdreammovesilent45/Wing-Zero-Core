import { prisma } from "@/lib/prisma";
import { events } from "@/lib/events";

export async function GET(_: Request, { params }: { params: { id: string } }) {
	const { id } = params;
	const messages = await prisma.chatMessage.findMany({ where: { threadId: id }, orderBy: { createdAt: "asc" } });
	return Response.json({ ok: true, messages });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
	const { id } = params;
	const { content } = await req.json();
	const userMsg = await prisma.chatMessage.create({ data: { threadId: id, role: "user", content } });
	events.emit({ type: "chat/message", threadId: id, role: "user", content });
	// very simple assistant reply (echo)
	const reply = `Echo: ${content}`;
	const assistantMsg = await prisma.chatMessage.create({ data: { threadId: id, role: "assistant", content: reply } });
	events.emit({ type: "chat/message", threadId: id, role: "assistant", content: reply });
	await prisma.chatThread.update({ where: { id }, data: { updatedAt: new Date() } });
	return Response.json({ ok: true, messages: [userMsg, assistantMsg] });
}