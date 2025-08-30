"use client";

import { useEffect, useState } from "react";

export default function IntegrationsPage() {
	const [brokers, setBrokers] = useState<any>(null);
	const [quotes, setQuotes] = useState<any>(null);
	const [calendar, setCalendar] = useState<any>(null);
	const [sentiment, setSentiment] = useState<any>(null);

	useEffect(() => {
		fetch("/api/integrations/brokers").then((r) => r.json()).then(setBrokers);
		fetch("/api/integrations/quotes").then((r) => r.json()).then(setQuotes);
		fetch("/api/integrations/calendar").then((r) => r.json()).then(setCalendar);
		fetch("/api/integrations/sentiment").then((r) => r.json()).then(setSentiment);
	}, []);

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Unified Integrations</h1>
			<section className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2 rounded border border-white/10 p-4">
					<h2 className="text-lg font-semibold">Broker</h2>
					<p className="text-sm text-gray-300">Provider: {brokers?.selected}</p>
					<p className="text-sm text-gray-300">Connected: {String(brokers?.status?.connected)}</p>
					<p className="text-sm text-gray-300">Balance: {brokers?.status?.balance?.balance} {brokers?.status?.balance?.currency}</p>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4">
					<h2 className="text-lg font-semibold">Quotes</h2>
					<ul className="text-sm">
						{quotes && Object.entries(quotes.quotes).map(([s, p]: any) => (
							<li key={s}>{s}: {Number(p).toFixed(5)}</li>
						))}
					</ul>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4 md:col-span-2">
					<h2 className="text-lg font-semibold">Economic Calendar</h2>
					<ul className="text-sm">
						{calendar?.events?.map((e: any) => (
							<li key={e.id}>{new Date(e.time).toLocaleString()} - {e.impact.toUpperCase()} - {e.title}</li>
						))}
					</ul>
				</div>
				<div className="space-y-2 rounded border border-white/10 p-4 md:col-span-2">
					<h2 className="text-lg font-semibold">Sentiment</h2>
					<ul className="text-sm">
						{sentiment?.sentiments?.map((s: any) => (
							<li key={s.symbol}>{s.symbol}: {s.avg.toFixed(3)}</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	);
}