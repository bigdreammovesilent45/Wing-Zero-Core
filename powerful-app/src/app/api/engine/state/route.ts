import { engine } from "@/lib/engine";

export async function GET() {
	return Response.json({ ok: true, state: engine.getState() });
}