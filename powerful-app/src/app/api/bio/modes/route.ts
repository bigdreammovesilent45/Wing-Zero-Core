import { bio } from "@/lib/bio";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const modes = await prisma.bioMode.findMany({ orderBy: { key: "asc" } });
	return Response.json({ ok: true, modes, active: bio.getState().activeModes });
}

export async function POST(req: Request) {
	const { active } = await req.json();
	await bio.setActiveModes(Array.isArray(active) ? active : []);
	return Response.json({ ok: true, state: bio.getState() });
}