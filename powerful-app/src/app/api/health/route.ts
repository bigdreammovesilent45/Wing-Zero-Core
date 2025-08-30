import { getBrokerAdapter } from "@/lib/broker";
import { market } from "@/lib/market";
import { engine } from "@/lib/engine";
import { profiler } from "@/lib/profiler";
import { ai } from "@/lib/ai";
import { cache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
	const key = "health_v1";
	const cached = cache.get(key) as any | undefined;
	if (cached) return Response.json(cached);
	const broker = getBrokerAdapter();
	await broker.connect();
	const balance = await broker.getBalance();
	const payload = {
		ok: true,
		timestamp: new Date().toISOString(),
		broker: { name: broker.name, connected: broker.isConnected(), balance },
		market: market.status(),
		engine: engine.getState(),
		ai: ai.getState(),
		profiler: profiler.metrics().slice(0, 10),
	};
	cache.set(key, payload, 5_000);
	return Response.json(payload);
}