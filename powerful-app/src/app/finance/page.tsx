"use client";

import { useState } from "react";

export default function FinancePage() {
	const [opt, setOpt] = useState<any | null>(null);
	const [varRes, setVarRes] = useState<any | null>(null);
	const [bt, setBt] = useState<any | null>(null);

	async function runOptimize() {
		const r = await fetch("/api/finance/optimize?symbols=EURUSD,BTCUSD&timeframe=1m&lookback=200");
		setOpt(await r.json());
	}
	async function runVaR() {
		const r = await fetch("/api/finance/var?symbol=EURUSD&timeframe=1m&lookback=200&confidence=0.95");
		setVarRes(await r.json());
	}
	async function runBacktest() {
		const r = await fetch("/api/finance/backtest?symbols=EURUSD,BTCUSD&timeframe=1m&lookback=200");
		setBt(await r.json());
	}

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Advanced Financial Models</h1>
			<div className="flex gap-2">
				<button onClick={runOptimize} className="rounded bg-white/10 px-3 py-2 hover:bg-white/20">Optimize Portfolio</button>
				<button onClick={runVaR} className="rounded bg-white/10 px-3 py-2 hover:bg-white/20">Compute VaR</button>
				<button onClick={runBacktest} className="rounded bg-white/10 px-3 py-2 hover:bg-white/20">Backtest Buy&Hold</button>
			</div>
			{opt && (
				<section className="rounded border border-white/10 p-4 text-sm">
					<h2 className="text-lg font-semibold">Optimization</h2>
					<p>Weights: {Array.isArray(opt.weights) ? opt.weights.map((w: number) => w.toFixed(3)).join(", ") : "-"}</p>
					<p>Expected Return: {(opt.expectedReturn * 100).toFixed(2)}%</p>
					<p>Risk (stdev): {(opt.risk * 100).toFixed(2)}%</p>
				</section>
			)}
			{varRes && (
				<section className="rounded border border-white/10 p-4 text-sm">
					<h2 className="text-lg font-semibold">VaR</h2>
					<p>{varRes.symbol} {varRes.timeframe} VaR @ {Math.round(varRes.confidence*100)}%: {(varRes.var * 100).toFixed(2)}%</p>
				</section>
			)}
			{bt && (
				<section className="rounded border border-white/10 p-4 text-sm">
					<h2 className="text-lg font-semibold">Backtest (Buy & Hold)</h2>
					<ul className="list-disc pl-5">
						{bt.results?.map((r: any) => (
							<li key={r.symbol}>{r.symbol}: {(r.cumulativeReturn * 100).toFixed(2)}%</li>
						))}
					</ul>
				</section>
			)}
		</main>
	);
}