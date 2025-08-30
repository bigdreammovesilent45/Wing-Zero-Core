import { engine } from "@/lib/engine";

export async function POST() {
	engine.start();
	return Response.json({ ok: true, state: engine.getState() });
}