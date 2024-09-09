"use client";

import Image from "next/image";
import { Rocket, Hammer } from "lucide-react";
import type { Session } from "next-auth";
import { Card, CardContent } from "./ui/card";

type ProjectViewProps = {
	projectName: string | null;
	category: string;
	projectDescription: string;
	projectImage: string | null;
	id: string;
	created_by: string;
	createdAt: Date;
	updatedAt: Date | null;
	likes: number | null;
	makes: number | null;
	steps: string[];
};

export function ProjectViewUser({
	project,
	session,
}: { project: ProjectViewProps; session: Session }) {
	return (
		<Card className="w-full h-0 bg-white/80 shadow-xl shadow-slate-700/70 rounded-2xl aspect-w-2 aspect-h-3">
			<CardContent className="p-2 object-cover h-full">
				<div className="aspect-w-16 aspect-h-9">
					<Image
						className="p-0 m-0 overflow-clip rounded-xl object-cover"
						src={project?.projectImage ?? "/images/placeholder.webp"}
						alt="Project Image"
						width={500}
						height={300}
					/>
				</div>
				<div className="flex flex-col p-2 gap-4">
					<p className="text-start mt-4 text-lg h-12">{project?.projectName}</p>
					<p className="h-full text-left text-wrap overflow-hidden">
						{project?.projectDescription}
					</p>
					<div className="absolute bottom-3 ">
						<p className="inline text-left w-full">{session?.user.name} </p>
					</div>
					<div className="absolute right-4 bottom-3 space-x-3">
						<div className="inline-block rounded-full shadow px-2.5 shadow-red-900/30">
							<Rocket size={16} className="inline-block text-red-500" />
							<p className="inline-block ml-2">{project.likes}</p>
						</div>
						<div className="inline-block rounded-full shadow px-2.5 shadow-sky-600/30">
							<Hammer size={16} className="inline-block text-sky-500" />
							<p className="inline-block ml-2">{project.makes}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
