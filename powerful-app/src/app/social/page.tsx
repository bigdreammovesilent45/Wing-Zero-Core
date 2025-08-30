"use client";

import { useEffect, useState } from "react";

export default function SocialPage() {
	const [subs, setSubs] = useState<any[]>([]);
	const [execs, setExecs] = useState<any[]>([]);
	const [perf, setPerf] = useState<any[]>([]);
	const [leader, setLeader] = useState("demo-strategy");
	const [scale, setScale] = useState(1);
	const [alerts, setAlerts] = useState<any[]>([]);
	const [events, setEvents] = useState<any[]>([]);
	const [alertType, setAlertType] = useState("pnl_threshold");
	const [alertParams, setAlertParams] = useState("{\"threshold\": 100, \"direction\": \"above\"}");

	async function refresh() {
		const s = await fetch("/api/social/subscriptions").then((r) => r.json());
		setSubs(s.subscriptions ?? []);
		const e = await fetch("/api/social/executions").then((r) => r.json());
		setExecs(e.executions ?? []);
		const p = await fetch("/api/social/performance").then((r) => r.json());
		setPerf(p.performance ?? []);
		const al = await fetch("/api/social/alerts").then((r) => r.json());
		setAlerts(al.alerts ?? []);
		const ev = await fetch("/api/social/alerts?events=1").then((r) => r.json());
		setEvents(ev.events ?? []);
	}

	async function createSub() {
		await fetch("/api/social/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leaderStrategyId: leader, scale }) });
		refresh();
	}

	async function createAlert() {
		let params: any = {};
		try { params = JSON.parse(alertParams); } catch {}
		await fetch("/api/social/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: alertType, params }) });
		refresh();
	}

	useEffect(() => { refresh(); }, []);

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Social & Institutional</h1>
			<section className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2 rounded border border-white/10 p-4">
					<h2 className="text-lg font-semibold">Copy Trading</h2>
					<div className="flex items-end gap-2">
						<label className="text-sm">Leader Strategy
							<input className="mt-1 block rounded bg-gray-900 px-2 py-1" value={leader} onChange={(e) => setLeader(e.target.value)} />
						</label>
						<label className="text-sm">Scale
							<input className="mt-1 block w-24 rounded bg-gray-900 px-2 py-1" type="number" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
						</label>
						<button onClick={createSub} className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Subscribe</button>
					</div>
					<ul className="text-sm">
						{subs.map((s) => (
							<li key={s.id}>{s.leaderStrategyId} x{s.scale} ({s.active ? "active" : "inactive"})</li>
						))}
					</ul>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4">
					<h2 className="text-lg font-semibold">Performance (by leader)</h2>
					<ul className="text-sm">
						{perf.map((p) => (
							<li key={p.strategyId}>{p.strategyId}: PnL {p.pnl?.toFixed?.(2)} (W{p.wins}/L{p.losses})</li>
						))}
					</ul>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4">
					<h2 className="text-lg font-semibold">Alerts</h2>
					<div className="flex items-end gap-2">
						<label className="text-sm">Type
							<select className="mt-1 rounded bg-gray-900 px-2 py-1" value={alertType} onChange={(e) => setAlertType(e.target.value)}>
								<option value="pnl_threshold">PnL Threshold</option>
								<option value="sentiment_threshold">Sentiment Threshold</option>
						</select>
						</label>
						<label className="text-sm">Params JSON
							<input className="mt-1 w-72 rounded bg-gray-900 px-2 py-1" value={alertParams} onChange={(e) => setAlertParams(e.target.value)} />
						</label>
						<button onClick={createAlert} className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Create</button>
					</div>
					<ul className="text-sm">
						{alerts.map((a) => (
							<li key={a.id}>{a.type} {a.active ? "active" : "inactive"} params {a.params}</li>
						))}
					</ul>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4">
					<h2 className="text-lg font-semibold">Alert Events</h2>
					<ul className="max-h-48 overflow-auto text-sm">
						{events.map((e) => (
							<li key={e.id}>{e.type} {e.meta}</li>
						))}
					</ul>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4 md:col-span-2">
					<h2 className="text-lg font-semibold">Recent Executions</h2>
					<ul className="grid grid-cols-1 gap-1 text-sm md:grid-cols-2 lg:grid-cols-3">
						{execs.map((e) => (
							<li key={e.id} className="rounded border border-white/10 p-2">
								{e.strategyId} {e.symbol} size {e.size} pnl {e.pnl?.toFixed?.(2)} {e.win ? "✓" : "✗"}
							</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	);
}