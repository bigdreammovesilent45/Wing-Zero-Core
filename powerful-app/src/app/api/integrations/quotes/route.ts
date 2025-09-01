import { market } from "@/lib/market";

export async function GET() {
	return Response.json({ ok: true, quotes: market.status().prices });
}