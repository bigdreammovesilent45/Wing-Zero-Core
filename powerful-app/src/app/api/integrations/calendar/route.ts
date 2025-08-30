export async function GET() {
	const now = Date.now();
	return Response.json({
		ok: true,
		events: [
			{ id: "ec1", time: new Date(now + 3600_000).toISOString(), impact: "high", title: "FOMC Minutes" },
			{ id: "ec2", time: new Date(now + 7200_000).toISOString(), impact: "medium", title: "CPI Release" },
		],
	});
}