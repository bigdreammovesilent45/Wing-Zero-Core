export { default } from "next-auth/middleware";

export const config = {
	matcher: ["/((?!api/health|api/stream|signin|_next|favicon.ico|static).*)"],
};