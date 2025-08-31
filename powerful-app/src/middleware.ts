import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const publicPaths = [
	"/signin",
	"/signup",
	"/api/health",
	"/api/stream",
	"/api/auth/signup",
	"/favicon.ico",
];

const rateLimitPaths = new Set<string>([
	"/api/auth/signup",
	"/api/security/mfa/setup",
	"/api/security/mfa/enable",
	"/api/security/mfa/disable",
	"/api/integrations/order",
	"/api/signed/",
	"/api/stripe/webhook",
]);

// naive in-memory limiter (per edge instance)
const rlStore: Record<string, { count: number; resetAt: number }> = {};
function rateLimit(ip: string, path: string) {
	const now = Date.now();
	const key = `${ip}:${path}`;
	const windowMs = 60_000;
	const limit = 20;
	const rec = rlStore[key] ?? { count: 0, resetAt: now + windowMs };
	if (now > rec.resetAt) {
		rec.count = 0;
		rec.resetAt = now + windowMs;
	}
	rec.count += 1;
	rlStore[key] = rec;
	return rec.count <= limit;
}

export default withAuth(
	function middleware(req) {
		const { pathname } = req.nextUrl;
		if (publicPaths.some((p) => pathname.startsWith(p))) {
			return NextResponse.next();
		}

		// Rate limit sensitive endpoints
		for (const p of rateLimitPaths) {
			if (pathname.startsWith(p)) {
				const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
				if (!rateLimit(ip, p)) {
					return new NextResponse("Too Many Requests", { status: 429 });
				}
				break;
			}
		}

		// Restrict admin to allowed email
		if (pathname.startsWith("/admin")) {
			const allowed = process.env.ALLOWED_EMAIL?.toLowerCase();
			const email = (req as any).nextauth?.token?.email?.toLowerCase();
			if (!allowed || !email || email !== allowed) {
				return NextResponse.redirect(new URL("/signin", req.url));
			}
		}
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => {
				// NextAuth will handle redirect for protected pages; public paths bypassed above
				return !!token;
			},
		},
	}
);

export const config = {
	matcher: ["/((?!_next|static).*)"],
};