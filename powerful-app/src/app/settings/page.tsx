"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
	const [theme, setTheme] = useState<string>("dark");
	const [notifications, setNotifications] = useState<boolean>(true);

	useEffect(() => {
		const t = localStorage.getItem("pref_theme");
		const n = localStorage.getItem("pref_notifications");
		if (t) setTheme(t);
		if (n) setNotifications(n === "1");
	}, []);

	useEffect(() => {
		localStorage.setItem("pref_theme", theme);
		localStorage.setItem("pref_notifications", notifications ? "1" : "0");
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme, notifications]);

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Settings</h1>
			<div className="space-y-4">
				<div>
					<label className="block text-sm text-gray-300">Theme</label>
					<select value={theme} onChange={(e) => setTheme(e.target.value)} className="mt-1 rounded bg-gray-900 px-3 py-2">
						<option value="dark">Dark</option>
						<option value="light">Light</option>
					</select>
				</div>
				<div className="flex items-center gap-2">
					<input id="notifications" type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
					<label htmlFor="notifications" className="text-sm text-gray-300">Enable notifications</label>
				</div>
			</div>
		</main>
	);
}