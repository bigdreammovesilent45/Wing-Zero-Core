import { getBrokerAdapter } from "@/lib/broker";

export async function GET() {
	const providers = ["mock", "oanda"] as const;
	const selected = (process.env.BROKER_PROVIDER ?? "mock").toLowerCase();
	const broker = getBrokerAdapter();
	await broker.connect();
	const balance = await broker.getBalance();
	return Response.json({ ok: true, providers, selected, status: { connected: broker.isConnected(), balance } });
}