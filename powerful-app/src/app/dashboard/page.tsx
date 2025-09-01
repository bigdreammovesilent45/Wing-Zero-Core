import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createProjectFromDashboard, createTaskFromDashboard, setTaskStatusFromDashboard, deleteProjectFromDashboard, deleteTaskFromDashboard } from "./actions";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) {
		return (
			<main className="p-8">
				<p>You are not signed in. Go to the <Link className="underline" href="/signin">sign in</Link> page.</p>
			</main>
		);
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		include: {
			projects: { include: { tasks: true } },
		},
	});

	return (
		<main className="p-8 space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<form action={async (formData) => {
					'use server';
					await createProjectFromDashboard(formData);
				}} className="flex gap-2">
					<input name="name" placeholder="New project name" className="rounded bg-gray-900 px-3 py-2" required />
					<input name="description" placeholder="Description" className="rounded bg-gray-900 px-3 py-2" />
					<button className="rounded bg-white/10 px-3 py-2 hover:bg-white/20">Create</button>
				</form>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{user?.projects.map((p) => (
					<div key={p.id} className="rounded border border-white/10 p-4 space-y-3">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="font-semibold">{p.name}</h2>
								<p className="text-sm text-gray-400">{p.description}</p>
							</div>
							<form action={async () => {
								'use server';
								await deleteProjectFromDashboard(p.id);
							}}>
								<button className="text-sm text-red-300 hover:text-red-200">Delete</button>
							</form>
						</div>

						<form action={async (formData) => {
							'use server';
							formData.set('projectId', p.id);
							await createTaskFromDashboard(formData);
						}} className="flex gap-2">
							<input name="title" placeholder="New task title" className="rounded bg-gray-900 px-3 py-2" required />
							<input name="description" placeholder="Description" className="rounded bg-gray-900 px-3 py-2" />
							<button className="rounded bg-white/10 px-3 py-2 hover:bg-white/20">Add</button>
						</form>

						<ul className="mt-3 space-y-2 text-sm">
							{p.tasks.map((t) => (
								<li key={t.id} className="flex items-center justify-between gap-2">
									<div className="min-w-0">
										<p className="truncate">{t.title}</p>
										<p className="text-xs text-gray-500">{t.status}</p>
									</div>
									<div className="flex items-center gap-2">
										<form action={async () => {
											'use server';
											await setTaskStatusFromDashboard(t.id, t.status === 'DONE' ? 'TODO' : 'DONE');
										}}>
											<button className="rounded bg-white/10 px-2 py-1 hover:bg-white/20">{t.status === 'DONE' ? 'Mark TODO' : 'Mark DONE'}</button>
										</form>
										<form action={async () => {
											'use server';
											await deleteTaskFromDashboard(t.id);
										}}>
											<button className="text-red-300 hover:text-red-200">Delete</button>
										</form>
									</div>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</main>
	);
}