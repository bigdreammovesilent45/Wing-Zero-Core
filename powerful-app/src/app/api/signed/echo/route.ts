import { verifyRequestSignature, readRequestBodyText } from "@/lib/signing";

export async function POST(req: Request) {
	const bodyText = await readRequestBodyText(req.clone());
	const v = await verifyRequestSignature(req, bodyText);
	if (!v.ok) return new Response(JSON.stringify({ ok: false, error: v.reason }), { status: 401 });
	return Response.json({ ok: true, echo: bodyText });
}