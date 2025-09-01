import { market } from "@/lib/market";

export async function POST() {
	market.start();
	return Response.json({ ok: true, status: market.status() });
}