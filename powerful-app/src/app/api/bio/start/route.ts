import { bio } from "@/lib/bio";

export async function POST() {
	await bio.ensureDefaultModes();
	await bio.setActiveModes(["blue_butterfly", "smart_money_follow", "swarm_mimicry"]);
	bio.start();
	return Response.json({ ok: true, state: bio.getState() });
}