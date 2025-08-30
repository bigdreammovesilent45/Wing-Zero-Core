import { getBrokerAdapter } from "@/lib/broker";
import { auditLog } from "@/lib/audit";

export async function POST(req: Request) {
	const broker = getBrokerAdapter();
	await broker.connect();
	const body = await req.json().catch(() => ({}));
	const { symbol, side, type, size, price } = body;
	if (!symbol || !side || !type || !size) return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400 });
	const resp = await broker.placeOrder({ symbol, side, type, size, price });
	await auditLog({ action: "order.place", route: "/api/integrations/order", ip: req.headers.get("x-forwarded-for") || null, meta: { symbol, side, type, size } });
	return Response.json({ ok: true, order: resp });
}