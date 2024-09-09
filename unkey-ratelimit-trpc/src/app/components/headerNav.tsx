"use client";
import Link from "next/link";

import { usePathname } from "next/navigation";

export function HeaderNav({loggedIn}:{loggedIn: boolean}) {
	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Projects", path: "/projects" },
		{
			name: loggedIn ? "Sign Out" : "Sign In",
			path: loggedIn ? "/api/auth/signout" : "/api/auth/signin",
		},
	];
	const path = usePathname();

	return (
		<div className="flex flex-row gap-8 my-auto w-full ">
			{navLinks.map((link) =>
				link.name === "Sign Out" || link.name === "Sign In" ? (
					<div
						key={link.name}
						className="flex justify-end content-end item-end font-semibold px-8 py-4"
					>
						<Link href={link.path}>
							<p>{link.name}</p>
						</Link>
					</div>
				) : (
					<div
						key={link.name}
						className={`flex justify-end px-8 py-4 content-end item-end font-semibold ${path === link.path ? 'rounded-lg shadow shadow-slate-700 bg-gradient-to-tl from-slate-50 to-slate-200': null}`}
					>
						<Link href={link.path}>
							<p>{link.name}</p>
						</Link>
					</div>
				),
			)}
		</div>
	);
}
