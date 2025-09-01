"use client";

import { useEffect, useState } from "react";

export default function AIPage() {
	const [running, setRunning] = useState(false);
	const [insights, setInsights] = useState<any[]>([]);
	const [predictions, setPredictions] = useState<any[]>([]);
	const [risks, setRisks] = useState<any[]>([]);

	useEffect(() => {
		fetch("/api/ai/status").then(r => r.json()).then(d => setRunning(d.state.isRunning));
		const es = new EventSource("/api/stream");
		es.addEventListener("ai/status", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setRunning(Boolean(data.isRunning));
		});
		es.addEventListener("ai/insight", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setInsights((x) => [data, ...x].slice(0, 20));
		});
		es.addEventListener("ai/prediction", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setPredictions((x) => [data, ...x].slice(0, 20));
		});
		es.addEventListener("ai/risk", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setRisks((x) => [data, ...x].slice(0, 20));
		});
		return () => es.close();
	}, []);

	async function start() {
		await fetch("/api/ai/start", { method: "POST" });
	}
	async function stop() {
		await fetch("/api/ai/stop", { method: "POST" });
	}

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">AI Brain & Analytics</h1>
			<div className="flex items-center gap-3">
				<button onClick={start} className="rounded bg-green-600/80 px-4 py-2 hover:bg-green-600">Start AI</button>
				<button onClick={stop} className="rounded bg-red-600/80 px-4 py-2 hover:bg-red-600">Stop AI</button>
				<span className={`rounded px-2 py-1 text-sm ${running ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>{running ? "Running" : "Stopped"}</span>
			</div>

			<section className="grid gap-4 md:grid-cols-3">
				<div className="space-y-2">
					<h2 className="text-lg font-semibold">Insights</h2>
					<ul className="divide-y divide-white/10 rounded border border-white/10">
						{insights.map((i, idx) => (
							<li key={idx} className="flex items-center justify-between p-3 text-sm">
								<span>{i.kind} {i.symbol ?? ""}</span>
								<span className="text-gray-300">{i.score?.toFixed?.(3) ?? i.pattern ?? ""}</span>
							</li>
						))}
					</ul>
				</div>
				<div className="space-y-2">
					<h2 className="text-lg font-semibold">Predictions</h2>
					<ul className="divide-y divide-white/10 rounded border border-white/10">
						{predictions.map((p, idx) => (
							<li key={idx} className="flex items-center justify-between p-3 text-sm">
								<span>{p.symbol} / {p.horizonSec}s</span>
								<span className="text-gray-300">{(p.predictedReturn*100).toFixed(3)}% ({(p.confidence*100).toFixed(0)}%)</span>
							</li>
						))}
					</ul>
				</div>
				<div className="space-y-2">
					<h2 className="text-lg font-semibold">Risk Scores</h2>
					<ul className="divide-y divide-white/10 rounded border border-white/10">
						{risks.map((r, idx) => (
							<li key={idx} className="flex items-center justify-between p-3 text-sm">
								<span>{r.symbol} / {r.timeframe}</span>
								<span className="text-gray-300">{r.score.toFixed(2)}</span>
							</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	);
}