"use client";
import Link from "next/link";
import { Binary, VenetianMask, Bot, CircuitBoard, Brush, Hammer, TreeDeciduous, Cog, Cuboid} from 'lucide-react';
export function Categories() {
	return (
		<div className="flex w-48 justify-start p-4 bg-white">
			<div className="">
                <div className="flex flex-row gap-4"><Cuboid size="16" className="mt-1"/><h3 className="inline-block">Categories</h3></div>
				
				<ul className="space-y-4 mt-6">
					<li className="flex flex-row gap-4"><Brush size="16" className="mt-1"/>
						<Link href="/Art">
							<p>Art</p>
						</Link>
					</li>
					<li className="flex flex-row gap-4"><VenetianMask size="16" className="mt-1"/>
						<Link href="/Cosplay">
							<p>Cosplay</p>
						</Link>
					</li>
					<li className="flex flex-row gap-4"> <Binary size="16" className="mt-1"/>
						<Link href="/Coding">
							<p>Coding</p>
						</Link>
					</li>
					<li className="flex flex-row gap-4"><Bot size="16" className="mt-1"/>
						<Link href="/Robotics">
							<p>Robotics</p>
						</Link>
					</li>
					<li className="flex flex-row gap-4"><CircuitBoard  size="16" className="mt-1"/>
						<Link href="/Electronics">
							<p>Electronics</p>
						</Link>
					</li>
					<li className="flex flex-row gap-4"><Hammer size="16" className="mt-1"/>
						<Link href="/Tools">
							<p>Tools</p>
						</Link>
					</li>
					<li className="flex flex-row gap-4"><TreeDeciduous size="16" className="mt-1"/>
						<Link href="/Woodwork">
							<p>Woodworking</p>
						</Link>
					</li>
					<li className="flex flex-row gap-4"><Cog size="16" className="mt-1"/>
						<Link href="/Mechanical">
							<p>Mechanical</p>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
