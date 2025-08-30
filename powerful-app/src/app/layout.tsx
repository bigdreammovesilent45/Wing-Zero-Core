import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";
import Toaster from "@/components/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Powerful App",
	description: "A modern Next.js + TypeScript + Tailwind starter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
					<nav className="mx-auto flex max-w-6xl items-center gap-4 p-4 text-sm">
						<Link href="/" className="font-semibold">Wing Zero</Link>
						<Link href="/wing-zero" className="text-gray-300 hover:text-white">Bot</Link>
						<Link href="/saw" className="text-gray-300 hover:text-white">SAW</Link>
						<Link href="/ai" className="text-gray-300 hover:text-white">AI</Link>
						<Link href="/bio" className="text-gray-300 hover:text-white">Bio</Link>
						<Link href="/finance" className="text-gray-300 hover:text-white">Finance</Link>
						<Link href="/integrations" className="text-gray-300 hover:text-white">Integrations</Link>
						<Link href="/social" className="text-gray-300 hover:text-white">Social</Link>
						<Link href="/chat" className="text-gray-300 hover:text-white">Chat</Link>
						<Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
						<Link href="/security" className="text-gray-300 hover:text-white">Security</Link>
						<Link href="/settings" className="ml-auto text-gray-300 hover:text-white">Settings</Link>
					</nav>
				</header>
				{children}
				<Toaster />
			</body>
		</html>
	);
}