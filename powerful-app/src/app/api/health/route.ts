import { getBrokerAdapter } from "@/lib/broker";
import { market } from "@/lib/market";
import { engine } from "@/lib/engine";
import { profiler } from "@/lib/profiler";
import { ai } from "@/lib/ai";

export async function GET() {
	const broker = getBrokerAdapter();
	await broker.connect();
	const balance = await broker.getBalance();
	return Response.json({
		ok: true,
		timestamp: new Date().toISOString(),
		broker: { name: broker.name, connected: broker.isConnected(), balance },
		market: market.status(),
		engine: engine.getState(),
		ai: ai.getState(),
		profiler: profiler.metrics().slice(0, 10),
	});
}