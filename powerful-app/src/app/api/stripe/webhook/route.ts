import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function verifyStripeSignature(rawBody: string, sigHeader: string | null, secret: string): boolean {
	if (!sigHeader) return false;
	// Tolerate simple HMAC scheme: t=timestamp,v1=signature
	try {
		const parts = Object.fromEntries(sigHeader.split(",").map((kv) => kv.split("=")) as any);
		const signedPayload = `${parts["t"]}.${rawBody}`;
		const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
		return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(parts["v1"], "hex"));
	} catch {
		return false;
	}
}

export async function POST(req: Request) {
	try {
		const rawBody = await req.text();
		const secret = process.env.STRIPE_WEBHOOK_SECRET;
		if (secret) {
			const ok = verifyStripeSignature(rawBody, req.headers.get("stripe-signature"), secret);
			if (!ok) return new Response("bad sig", { status: 401 });
		}
		const payload = JSON.parse(rawBody);
		const type = payload.type as string;
		if (type === "invoice.paid") {
			const email = payload?.data?.object?.customer_email as string | undefined;
			if (email) {
				const user = await prisma.user.findUnique({ where: { email } });
				if (user) {
					await prisma.entitlement.upsert({ where: { userId: user.id }, update: { premium: true }, create: { userId: user.id, premium: true } });
				}
			}
		}
		return new Response("ok", { status: 200 });
	} catch (e) {
		return new Response("bad", { status: 400 });
	}
}