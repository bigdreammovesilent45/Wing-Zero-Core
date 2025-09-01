import { market } from "@/lib/market";

export async function POST() {
	market.stop();
	return Response.json({ ok: true, status: market.status() });
}