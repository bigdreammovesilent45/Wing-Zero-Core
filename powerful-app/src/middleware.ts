export { default } from "next-auth/middleware";

export const config = {
	matcher: ["/((?!api/health|api/stream|api/auth/signup|signin|signup|_next|favicon.ico|static).*)"],
};