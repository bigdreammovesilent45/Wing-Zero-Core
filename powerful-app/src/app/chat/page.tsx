"use client";

import { useEffect, useState } from "react";

type Thread = { id: string; title: string | null };

type Message = { id?: string; role: string; content: string };

export default function ChatPage() {
	const [threads, setThreads] = useState<Thread[]>([]);
	const [currentThread, setCurrentThread] = useState<Thread | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");

	async function loadThreads() {
		const r = await fetch("/api/chat/threads");
		const d = await r.json();
		setThreads(d.threads);
		if (!currentThread && d.threads[0]) {
			selectThread(d.threads[0]);
		}
	}

	async function selectThread(t: Thread) {
		setCurrentThread(t);
		const r = await fetch(`/api/chat/threads/${t.id}/messages`);
		const d = await r.json();
		setMessages(d.messages);
	}

	async function createThread() {
		const r = await fetch("/api/chat/threads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "New Thread" }) });
		const d = await r.json();
		await loadThreads();
		if (d.thread) selectThread(d.thread);
	}

	async function sendMessage() {
		if (!currentThread || !input.trim()) return;
		const text = input;
		setInput("");
		setMessages((m) => [...m, { role: "user", content: text }]);
		const r = await fetch(`/api/chat/threads/${currentThread.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text }) });
		const d = await r.json();
		setMessages((m) => [...m, ...d.messages.filter((x: Message) => x.role === "assistant")]);
	}

	useEffect(() => {
		loadThreads();
		const es = new EventSource("/api/stream");
		es.addEventListener("chat/message", (e) => {
			const data = JSON.parse((e as MessageEvent).data);
			if (!currentThread || data.threadId !== currentThread.id) return;
			setMessages((m) => [...m, { role: data.role, content: data.content }]);
		});
		return () => es.close();
	}, [currentThread?.id]);

	return (
		<main className="grid min-h-[80vh] gap-4 p-6 md:grid-cols-3">
			<aside className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Threads</h2>
					<button onClick={createThread} className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20">New</button>
				</div>
				<ul className="divide-y divide-white/10 rounded border border-white/10">
					{threads.map((t) => (
						<li key={t.id}>
							<button onClick={() => selectThread(t)} className={`block w-full p-3 text-left text-sm hover:bg-white/5 ${currentThread?.id === t.id ? "bg-white/10" : ""}`}>{t.title ?? t.id.slice(0, 6)}</button>
						</li>
					))}
				</ul>
			</aside>
			<section className="md:col-span-2 flex flex-col">
				<div className="flex-1 space-y-2 overflow-auto rounded border border-white/10 p-3">
					{messages.map((m, i) => (
						<div key={i} className={`max-w-[80%] rounded px-3 py-2 ${m.role === "user" ? "ml-auto bg-blue-600/40" : "mr-auto bg-gray-800/80"}`}>
							<p className="whitespace-pre-wrap text-sm">{m.content}</p>
						</div>
					))}
				</div>
				<form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="mt-3 flex gap-2">
					<input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 rounded bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
					<button className="rounded bg-white/10 px-4 py-2 hover:bg-white/20">Send</button>
				</form>
			</section>
		</main>
	);
}