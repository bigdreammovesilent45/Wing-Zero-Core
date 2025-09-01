import { engine } from "@/lib/engine";
import { auditLog } from "@/lib/audit";

export async function POST(req: Request) {
	engine.start();
	await auditLog({ action: "engine.start", route: "/api/engine/start", ip: req.headers.get("x-forwarded-for") || null });
	return Response.json({ ok: true, state: engine.getState() });
}