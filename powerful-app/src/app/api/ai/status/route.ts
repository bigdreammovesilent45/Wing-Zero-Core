import { ai } from "@/lib/ai";

export async function GET() {
	return Response.json({ ok: true, state: ai.getState() });
}