"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Binary,
	VenetianMask,
	Bot,
	CircuitBoard,
	Brush,
	Hammer,
	TreeDeciduous,
	Cog,
} from "lucide-react";
export function Categories() {
	const path = usePathname();
	return (
		<div className="flex w-48 h-screen justify-start  bg-white sticky">
			<div className="w-full">
				<div className="flex flex-row gap-4 py-4 shadow-inner-lg shadow-slate-700 items-start justify-center rounded-lg">
					<h3 className="inline-block my-auto text-lg font-semibold">Categories</h3>
				</div>
				<ul className="space-y-4 mt-6">
					<li className={`flex flex-row gap-4 pl-4 py-2 ${path === '/art' ? 'rounded-lg shadow shadow-slate-700 bg-gradient-to-tl from-slate-50 to-slate-200' : null}`}>
						<Brush size="16" className="mt-1" />
						<Link href="/art">
							<p>Art</p>
						</Link>
					</li>
					<li className={`flex flex-row gap-4 pl-4 py-2 ${path === '/cosplay' ? 'rounded-lg shadow shadow-slate-700 bg-gradient-to-tl from-slate-50 to-slate-200' : null}`}>
						<VenetianMask size="16" className="mt-1" />
						<Link href="/cosplay">
							<p>Cosplay</p>
						</Link>
					</li>
					<li className={`flex flex-row gap-4 pl-4 py-2 ${path === '/coding' ? 'rounded-lg shadow shadow-slate-700 bg-gradient-to-tl from-slate-50 to-slate-200' : null}`}>
						{" "}
						<Binary size="16" className="mt-1" />
						<Link href="/coding">
							<p>Coding</p>
						</Link>
					</li>
					<li className={`flex flex-row gap-4 pl-4 py-2 ${path === '/robotics' ? 'rounded-lg shadow shadow-slate-700 bg-gradient-to-tl from-slate-50 to-slate-200' : null}`}>
						<Bot size="16" className="mt-1" />
						<Link href="/robotics">
							<p>Robotics</p>
						</Link>
					</li>
					<li className={`flex flex-row gap-4 pl-4 py-2 ${path === '/electronics' ? 'rounded-lg shadow shadow-slate-700 bg-gradient-to-tl from-slate-50 to-slate-200' : null}`}>
						<CircuitBoard size="16" className="mt-1" />
						<Link href="/electronics">
							<p>Electronics</p>
						</Link>
					</li>
					<li className={`flex flex-row gap-4 pl-4 py-2 ${path === '/tools' ? 'rounded-lg shadow shadow-slate-700 bg-gradient-to-tl from-slate-50 to-slate-200' : null}`}>
						<Hammer size="16" className="mt-1" />
						<Link href="/tools">
							<p>Tools</p>
						</Link>
					</li>
					<li className={`flex flex-row gap-4 pl-4 py-2 ${path === '/woodwork' ? 'rounded-lg shadow shadow-slate-700 bg-gradient-to-tl from-slate-50 to-slate-200' : null}`}>
						<TreeDeciduous size="16" className="mt-1" />
						<Link href="/woodwork">
							<p>Woodworking</p>
						</Link>
					</li>
					<li className={`flex flex-row gap-4 pl-4 py-2 ${path === '/mechanical' ? 'rounded-lg border-b border-slate-900 bg-gradient-to-tl from-slate-50 to-slate-200' : null}`}>
						<Cog size="16" className="mt-1" />
						<Link href="/mechanical">
							<p>Mechanical</p>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
