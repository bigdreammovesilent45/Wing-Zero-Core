import { ai } from "@/lib/ai";

export async function POST() {
	ai.stop();
	return Response.json({ ok: true, state: ai.getState() });
}