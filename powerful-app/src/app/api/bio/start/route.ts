import { bio } from "@/lib/bio";

export async function POST() {
	await bio.ensureDefaultModes();
	bio.start();
	return Response.json({ ok: true, state: bio.getState() });
}