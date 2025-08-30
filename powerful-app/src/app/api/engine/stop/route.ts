import { engine } from "@/lib/engine";

export async function POST() {
	engine.stop();
	return Response.json({ ok: true, state: engine.getState() });
}