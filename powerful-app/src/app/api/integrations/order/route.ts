import { getBrokerAdapter } from "@/lib/broker";

export async function POST(req: Request) {
	const broker = getBrokerAdapter();
	await broker.connect();
	const body = await req.json().catch(() => ({}));
	const { symbol, side, type, size, price } = body;
	if (!symbol || !side || !type || !size) return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400 });
	const resp = await broker.placeOrder({ symbol, side, type, size, price });
	return Response.json({ ok: true, order: resp });
}