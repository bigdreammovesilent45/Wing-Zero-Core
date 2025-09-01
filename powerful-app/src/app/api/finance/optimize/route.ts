import { optimizePortfolio } from "@/lib/finance";
import { cache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const symbols = (url.searchParams.get("symbols") ?? "EURUSD,BTCUSD").split(",").map((s) => s.trim()).filter(Boolean);
	const timeframe = url.searchParams.get("timeframe") ?? "1m";
	const lookback = Number(url.searchParams.get("lookback") ?? 200);
	const key = `opt:${symbols.join("_")}:${timeframe}:${lookback}`;
	const cached = cache.get(key) as any | undefined;
	if (cached) return Response.json(cached);
	const result = await optimizePortfolio(symbols, timeframe, lookback);
	const payload = { ok: true, symbols, timeframe, lookback, ...result };
	cache.set(key, payload, 10_000);
	return Response.json(payload);
}