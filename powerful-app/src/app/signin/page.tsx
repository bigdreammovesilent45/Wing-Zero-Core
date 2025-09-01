"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
	const router = useRouter();
	const [email, setEmail] = useState("demo@example.com");
	const [password, setPassword] = useState("password123");
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
			otp: otp || undefined,
		});
		setLoading(false);
		if (res?.error) {
			setError("Invalid credentials or OTP");
			return;
		}
		router.push("/dashboard");
	}

	return (
		<main className="min-h-screen grid place-items-center p-8">
			<form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded border border-white/10 p-6">
				<h1 className="text-2xl font-semibold">Sign in</h1>
				<label className="block">
					<span className="text-sm text-gray-300">Email</span>
					<input
						className="mt-1 w-full rounded bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						required
					/>
				</label>
				<label className="block">
					<span className="text-sm text-gray-300">Password</span>
					<input
						className="mt-1 w-full rounded bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						required
					/>
				</label>
				<label className="block">
					<span className="text-sm text-gray-300">One-time code (if MFA enabled)</span>
					<input
						className="mt-1 w-full rounded bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						type="text"
						inputMode="numeric"
						placeholder="123456"
					/>
				</label>
				{error && <p className="text-sm text-red-400">{error}</p>}
				<button
					disabled={loading}
					className="w-full rounded bg-white/10 px-4 py-2 hover:bg-white/20 disabled:opacity-50"
				>
					{loading ? "Signing in..." : "Sign in"}
				</button>
			</form>
		</main>
	);
}