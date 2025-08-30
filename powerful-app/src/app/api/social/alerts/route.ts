import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const events = url.searchParams.get("events") === "1";
	if (events) {
		const rows = await prisma.alertEvent.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
		return Response.json({ ok: true, events: rows });
	}
	const alerts = await prisma.alert.findMany({ orderBy: { createdAt: "desc" } });
	return Response.json({ ok: true, alerts });
}

export async function POST(req: Request) {
	const { type, params, active } = await req.json();
	if (!type) return new Response(JSON.stringify({ ok: false, error: "type required" }), { status: 400 });
	const alert = await prisma.alert.create({ data: { type, params: JSON.stringify(params ?? {}), active: Boolean(active ?? true) } });
	return Response.json({ ok: true, alert });
}