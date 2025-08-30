import { optimizePortfolio } from "@/lib/finance";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const symbols = (url.searchParams.get("symbols") ?? "EURUSD,BTCUSD").split(",").map((s) => s.trim()).filter(Boolean);
	const timeframe = url.searchParams.get("timeframe") ?? "1m";
	const lookback = Number(url.searchParams.get("lookback") ?? 200);
	const result = await optimizePortfolio(symbols, timeframe, lookback);
	return Response.json({ ok: true, symbols, timeframe, lookback, ...result });
}