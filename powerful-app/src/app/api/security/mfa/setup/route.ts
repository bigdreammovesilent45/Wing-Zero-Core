import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authenticator } from "otplib";

export async function POST() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email || !session.user) {
		return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401 });
	}
	const secret = authenticator.generateSecret();
	const label = encodeURIComponent(session.user.email);
	const issuer = encodeURIComponent("WingZero");
	const otpauth = `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
	return Response.json({ ok: true, secret, otpauth });
}