import { prisma } from "@/lib/prisma";

export default async function AdminEntitlementsPage() {
	const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { entitlement: true } });
	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Admin · Entitlements</h1>
			<table className="w-full text-sm">
				<thead>
					<tr className="text-left">
						<th className="py-2">Email</th>
						<th>Premium</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.map((u) => (
						<tr key={u.id} className="border-t border-white/10">
							<td className="py-2">{u.email}</td>
							<td>{u.entitlement?.premium ? "Yes" : "No"}</td>
							<td>
								<form action={async () => {
									'use server';
									await prisma.entitlement.upsert({ where: { userId: u.id }, update: { premium: !(u.entitlement?.premium ?? false) }, create: { userId: u.id, premium: true } });
								}}>
									<button className="rounded bg-white/10 px-3 py-1 hover:bg-white/20">Toggle</button>
								</form>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}