import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
	const { email, password, accessCode, premium } = await req.json();
	if (!email || !password) return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400 });
	if (process.env.INVITE_ONLY === "true") {
		const code = process.env.ACCESS_CODE;
		if (!code || accessCode !== code) return new Response(JSON.stringify({ ok: false, error: "Invalid access code" }), { status: 403 });
	}
	const passwordHash = await bcrypt.hash(String(password), 10);
	const user = await prisma.user.upsert({
		where: { email },
		update: { passwordHash },
		create: { email, passwordHash },
	});
	if (premium === true) {
		await prisma.entitlement.upsert({ where: { userId: user.id }, update: { premium: true }, create: { userId: user.id, premium: true } });
	}
	return Response.json({ ok: true, userId: user.id });
}