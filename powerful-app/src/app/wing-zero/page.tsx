"use client";

import { useEffect, useRef, useState } from "react";

type EngineState = {
	isRunning: boolean;
	startedAt: number | null;
	profitPnl: number;
	winCount: number;
	lossCount: number;
	openTrades: number;
};

export default function WingZeroPage() {
	const [state, setState] = useState<EngineState>({ isRunning: false, startedAt: null, profitPnl: 0, winCount: 0, lossCount: 0, openTrades: 0 });
	const [trades, setTrades] = useState<{ id: string; pnl: number; win: boolean }[]>([]);
	const esRef = useRef<EventSource | null>(null);

	useEffect(() => {
		fetch("/api/engine/state").then((r) => r.json()).then((d) => setState(d.state));
		const es = new EventSource("/api/stream");
		esRef.current = es;
		es.addEventListener("engine/status", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setState((s) => ({ ...s, ...data }));
		});
		es.addEventListener("engine/metrics", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setState((s) => ({ ...s, profitPnl: data.pnl, winCount: data.wins, lossCount: data.losses }));
		});
		es.addEventListener("engine/trade", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setTrades((t) => [{ id: data.orderId, pnl: data.pnl, win: data.win }, ...t].slice(0, 20));
		});
		return () => es.close();
	}, []);

	async function start() {
		await fetch("/api/engine/start", { method: "POST" });
	}
	async function stop() {
		await fetch("/api/engine/stop", { method: "POST" });
	}

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Wing Zero Trading Bot</h1>
			<div className="flex gap-3">
				<button onClick={start} className="rounded bg-green-600/80 px-4 py-2 hover:bg-green-600">Start</button>
				<button onClick={stop} className="rounded bg-red-600/80 px-4 py-2 hover:bg-red-600">Stop</button>
				<span className={`rounded px-2 py-1 text-sm ${state.isRunning ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>{state.isRunning ? "Running" : "Stopped"}</span>
			</div>

			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded border border-white/10 p-4">
					<p className="text-sm text-gray-400">P&L</p>
					<p className={`text-2xl font-semibold ${state.profitPnl >= 0 ? "text-emerald-300" : "text-red-300"}`}>{state.profitPnl.toFixed(2)}</p>
				</div>
				<div className="rounded border border-white/10 p-4">
					<p className="text-sm text-gray-400">Win/Loss</p>
					<p className="text-2xl font-semibold">{state.winCount} / {state.lossCount}</p>
				</div>
				<div className="rounded border border-white/10 p-4">
					<p className="text-sm text-gray-400">Started</p>
					<p className="text-2xl font-semibold">{state.startedAt ? new Date(state.startedAt).toLocaleTimeString() : "-"}</p>
				</div>
				<div className="rounded border border-white/10 p-4">
					<p className="text-sm text-gray-400">Open Trades</p>
					<p className="text-2xl font-semibold">{state.openTrades}</p>
				</div>
			</section>

			<section className="space-y-2">
				<h2 className="text-xl font-semibold">Recent Trades</h2>
				<ul className="divide-y divide-white/10 rounded border border-white/10">
					{trades.map((t) => (
						<li key={t.id} className="flex items-center justify-between p-3">
							<span className="text-sm text-gray-300">{t.id.slice(0, 8)}</span>
							<span className={`text-sm ${t.pnl >= 0 ? "text-emerald-300" : "text-red-300"}`}>{t.pnl.toFixed(2)}</span>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}