import { ai } from "@/lib/ai";

export async function POST() {
	ai.start();
	return Response.json({ ok: true, state: ai.getState() });
}