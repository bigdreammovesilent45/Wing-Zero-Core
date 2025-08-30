import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encryptString } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { authenticator } from "otplib";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401 });
	const { secret, token } = await req.json().catch(() => ({ secret: null, token: null }));
	if (!secret || !token) return new Response(JSON.stringify({ ok: false, error: "Missing secret/token" }), { status: 400 });
	const ok = authenticator.check(String(token), String(secret));
	if (!ok) return new Response(JSON.stringify({ ok: false, error: "Invalid token" }), { status: 400 });
	const mfaSecretEnc = encryptString(String(secret));
	await prisma.user.update({ where: { email: session.user.email }, data: { mfaEnabled: true, mfaSecretEnc } });
	return Response.json({ ok: true });
}