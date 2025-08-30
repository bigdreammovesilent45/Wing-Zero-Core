import { events } from "@/lib/events";

export async function GET() {
	return new Response(
		new ReadableStream({
			start(controller) {
				const encoder = new TextEncoder();
				const unsubscribe = events.subscribe((evt) => {
					controller.enqueue(encoder.encode(`event: ${evt.type}\n`));
					controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
				});
				// Send a ping every 25s to keep connections alive
				const ping = setInterval(() => {
					controller.enqueue(encoder.encode(`event: ping\n`));
					controller.enqueue(encoder.encode(`data: ${Date.now()}\n\n`));
				}, 25000);
				// Clean up on close
				return () => {
					clearInterval(ping);
					unsubscribe();
				};
			},
		}),
		{
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				"Connection": "keep-alive",
			},
		}
	);
}