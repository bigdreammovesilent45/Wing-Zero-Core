import { bio } from "@/lib/bio";

export async function POST() {
	bio.stop();
	return Response.json({ ok: true, state: bio.getState() });
}