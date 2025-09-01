"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; message: string };

export function showToast(message: string) {
	window.dispatchEvent(new CustomEvent("app/toast", { detail: { message } }));
}

export default function Toaster() {
	const [toasts, setToasts] = useState<Toast[]>([]);
	useEffect(() => {
		function onToast(e: Event) {
			const detail = (e as CustomEvent).detail as { message: string };
			setToasts((prev) => [...prev, { id: Date.now(), message: detail.message }]);
		}
		window.addEventListener("app/toast", onToast as any);
		return () => window.removeEventListener("app/toast", onToast as any);
	}, []);
	useEffect(() => {
		if (!toasts.length) return;
		const t = setTimeout(() => setToasts((prev) => prev.slice(1)), 2500);
		return () => clearTimeout(t);
	}, [toasts]);
	return (
		<div className="pointer-events-none fixed inset-x-0 top-2 z-50 mx-auto flex max-w-md flex-col items-center gap-2">
			{toasts.map((t) => (
				<div key={t.id} className="pointer-events-auto w-full rounded bg-black/80 px-4 py-2 text-sm shadow">
					{t.message}
				</div>
			))}
		</div>
	);
}