import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const payload = await req.json();
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