"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [accessCode, setAccessCode] = useState("");
	const [message, setMessage] = useState<string | null>(null);
	const router = useRouter();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMessage(null);
		const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, accessCode }) });
		const d = await res.json();
		if (!d.ok) { setMessage(d.error || "Signup failed"); return; }
		setMessage("Account created. Please sign in.");
		setTimeout(() => router.push("/signin"), 800);
	}

	return (
		<main className="min-h-screen grid place-items-center p-8">
			<form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded border border-white/10 p-6">
				<h1 className="text-2xl font-semibold">Sign up</h1>
				<label className="block text-sm">
					<span className="text-gray-300">Email</span>
					<input className="mt-1 w-full rounded bg-gray-900 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
				</label>
				<label className="block text-sm">
					<span className="text-gray-300">Password</span>
					<input className="mt-1 w-full rounded bg-gray-900 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
				</label>
				<label className="block text-sm">
					<span className="text-gray-300">Access code</span>
					<input className="mt-1 w-full rounded bg-gray-900 px-3 py-2" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Required" />
				</label>
				{message && <p className="text-sm text-emerald-300">{message}</p>}
				<button className="w-full rounded bg-white/10 px-4 py-2 hover:bg-white/20">Create account</button>
			</form>
		</main>
	);
}