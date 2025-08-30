import { bio } from "@/lib/bio";

export async function GET() {
	return Response.json({ ok: true, state: bio.getState() });
}