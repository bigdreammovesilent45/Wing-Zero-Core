"use client";

import { useEffect, useState } from "react";

export default function BioPage() {
	const [running, setRunning] = useState(false);
	const [modes, setModes] = useState<any[]>([]);
	const [active, setActive] = useState<string[]>([]);
	const [signals, setSignals] = useState<any[]>([]);
	const [metrics, setMetrics] = useState<any[]>([]);

	async function refreshModes() {
		const r = await fetch("/api/bio/modes");
		const d = await r.json();
		setModes(d.modes);
		setActive(d.modes.filter((m: any) => m.active).map((m: any) => m.key));
	}

	async function start() {
		await fetch("/api/bio/start", { method: "POST" });
		setRunning(true);
	}
	async function stop() {
		await fetch("/api/bio/stop", { method: "POST" });
		setRunning(false);
	}
	async function saveActive() {
		await fetch("/api/bio/modes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active }) });
		refreshModes();
	}

	useEffect(() => {
		refreshModes();
		fetch("/api/bio/status").then(r => r.json()).then(d => setRunning(Boolean(d.state?.isRunning)));
		const es = new EventSource("/api/stream");
		es.addEventListener("bio/status", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setRunning(Boolean(data.isRunning));
		});
		es.addEventListener("bio/signal", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setSignals((s) => [data, ...s].slice(0, 50));
		});
		es.addEventListener("bio/metric", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			setMetrics((m) => [data, ...m].slice(0, 50));
		});
		return () => es.close();
	}, []);

	function toggleMode(key: string) {
		setActive((a) => a.includes(key) ? a.filter((k) => k !== key) : [...a, key]);
	}

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Biomimetic Intelligence</h1>
			<div className="flex items-center gap-3">
				<button onClick={start} className="rounded bg-green-600/80 px-4 py-2 hover:bg-green-600">Start</button>
				<button onClick={stop} className="rounded bg-red-600/80 px-4 py-2 hover:bg-red-600">Stop</button>
				<span className={`rounded px-2 py-1 text-sm ${running ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>{running ? "Running" : "Stopped"}</span>
				<button onClick={saveActive} className="ml-2 rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Save Modes</button>
			</div>

			<section className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2 rounded border border-white/10 p-4">
					<h2 className="text-lg font-semibold">Modes</h2>
					<ul className="text-sm">
						{modes.map((m) => (
							<li key={m.key}>
								<label className="inline-flex items-center gap-2">
									<input type="checkbox" checked={active.includes(m.key)} onChange={() => toggleMode(m.key)} />
									<span>{m.label}</span>
								</label>
							</li>
						))}
					</ul>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4">
					<h2 className="text-lg font-semibold">Recent Signals</h2>
					<ul className="max-h-64 overflow-auto text-sm">
						{signals.map((s, i) => (
							<li key={i}>{s.modeKey} [{s.kind}] {s.symbol}: {s.score?.toFixed?.(3)}</li>
						))}
					</ul>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4 md:col-span-2">
					<h2 className="text-lg font-semibold">Metrics</h2>
					<ul className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
						{metrics.map((m, i) => (
							<li key={i} className="rounded border border-white/10 p-2">{m.modeKey}: cpu {m.cpu_ms ?? m.value} mem {m.mem_mb ?? "-"}</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	);
}