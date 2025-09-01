import { events } from "@/lib/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	let unsubscribe: (() => void) | null = null;
	let ping: any = null;

	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();
			unsubscribe = events.subscribe((evt) => {
				controller.enqueue(encoder.encode(`event: ${evt.type}\n`));
				controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
			});
			ping = setInterval(() => {
				controller.enqueue(encoder.encode(`event: ping\n`));
				controller.enqueue(encoder.encode(`data: ${Date.now()}\n\n`));
			}, 25000);
		},
		cancel() {
			if (ping) clearInterval(ping);
			if (unsubscribe) unsubscribe();
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-store, must-revalidate",
			"Connection": "keep-alive",
		},
	});
}