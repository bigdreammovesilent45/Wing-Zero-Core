"use client";

import { useEffect, useState } from "react";

export default function SecurityPage() {
	const [status, setStatus] = useState<{ enabled: boolean } | null>(null);
	const [secret, setSecret] = useState<string | null>(null);
	const [otpauth, setOtpauth] = useState<string | null>(null);
	const [token, setToken] = useState("");
	const [message, setMessage] = useState<string | null>(null);

	async function fetchStatus() {
		// status from health is approximate; a precise status endpoint could be added. For now, show last setup state
		setStatus(null);
	}

	async function setup() {
		setMessage(null);
		const r = await fetch("/api/security/mfa/setup", { method: "POST" });
		if (!r.ok) { setMessage("Unauthorized"); return; }
		const d = await r.json();
		setSecret(d.secret);
		setOtpauth(d.otpauth);
	}

	async function enable() {
		setMessage(null);
		const r = await fetch("/api/security/mfa/enable", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret, token }) });
		const d = await r.json();
		if (!d.ok) { setMessage(d.error || "Failed to enable MFA"); return; }
		setMessage("MFA enabled");
		setSecret(null);
		setOtpauth(null);
	}

	async function disable() {
		setMessage(null);
		const r = await fetch("/api/security/mfa/disable", { method: "POST" });
		const d = await r.json();
		if (!d.ok) { setMessage(d.error || "Failed to disable MFA"); return; }
		setMessage("MFA disabled");
	}

	useEffect(() => { fetchStatus(); }, []);

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Security</h1>
			<section className="space-y-3">
				<h2 className="text-lg font-semibold">Multi-Factor Authentication (TOTP)</h2>
				<div className="space-y-2 rounded border border-white/10 p-4">
					<p className="text-sm text-gray-300">Use an authenticator app to secure your account.</p>
					<div className="flex gap-2">
						<button onClick={setup} className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Setup</button>
						<button onClick={disable} className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Disable</button>
					</div>
					{secret && (
						<div className="space-y-2">
							<p className="text-sm">Secret: <code className="rounded bg-gray-900 px-1.5 py-0.5">{secret}</code></p>
							{otpauth && <a className="text-sm underline" href={otpauth}>otpauth link</a>}
							<div className="flex items-end gap-2">
								<label className="block text-sm">
									<span className="text-gray-300">Enter code</span>
									<input value={token} onChange={(e) => setToken(e.target.value)} className="mt-1 w-40 rounded bg-gray-900 px-3 py-2" placeholder="123456" />
								</label>
								<button onClick={enable} className="rounded bg-green-600/80 px-3 py-2 hover:bg-green-600">Enable</button>
							</div>
						</div>
					)}
					{message && <p className="text-sm text-emerald-300">{message}</p>}
				</div>
			</section>
		</main>
	);
}