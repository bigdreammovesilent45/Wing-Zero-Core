import { prisma } from "@/lib/prisma";

export default async function SAWPage() {
	const thresholds = await prisma.sAWThreshold.findMany({ orderBy: { updatedAt: "desc" }, take: 20 });
	const withdrawals = await prisma.withdrawal.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">SAW Trading System</h1>
			<section className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<h2 className="text-xl font-semibold">Thresholds</h2>
					<ul className="divide-y divide-white/10 rounded border border-white/10">
						{thresholds.map((t) => (
							<li key={t.id} className="flex items-center justify-between p-3 text-sm">
								<span>{t.name}</span>
								<span className="text-gray-300">{t.value}</span>
							</li>
						))}
					</ul>
				</div>
				<div className="space-y-2">
					<h2 className="text-xl font-semibold">Withdrawals</h2>
					<ul className="divide-y divide-white/10 rounded border border-white/10">
						{withdrawals.map((w) => (
							<li key={w.id} className="flex items-center justify-between p-3 text-sm">
								<span>{new Date(w.createdAt).toLocaleString()}</span>
								<span className="text-gray-300">${w.amount.toFixed(2)}</span>
							</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	);
}