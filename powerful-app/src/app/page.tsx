export default function HomePage() {
	return (
		<main className="min-h-screen grid place-items-center p-8">
			<div className="max-w-2xl text-center">
				<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
					Build something powerful
				</h1>
				<p className="mt-4 text-lg text-gray-300">
					Next.js + TypeScript + Tailwind + Prisma starter. Edit this page in
					<code className="mx-2 rounded bg-gray-800 px-1.5 py-0.5">src/app/page.tsx</code>
					to get started.
				</p>
				<div className="mt-8 flex items-center justify-center gap-3">
					<a
						href="/api/health"
						className="rounded bg-white/10 px-4 py-2 text-white hover:bg-white/20"
					>
						API Health
					</a>
				</div>
			</div>
		</main>
	);
}