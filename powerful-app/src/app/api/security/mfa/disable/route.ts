import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401 });
	await prisma.user.update({ where: { email: session.user.email }, data: { mfaEnabled: false, mfaSecretEnc: null } });
	return Response.json({ ok: true });
}