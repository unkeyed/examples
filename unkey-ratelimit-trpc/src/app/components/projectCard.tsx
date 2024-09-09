import Image from "next/image"; 
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import type { ProjectCardSchema } from "~/lib/types";

export async function ProjectCard({ project }: { project: ProjectCardSchema }) {
	const session = await getServerAuthSession();

	return (
		<Link
			href={
				session?.user.id === project.created_by
					? `/projects/edit/${project.id}/`
					: `/projects/${project.id}/`
			}
		>
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
						<p className="text-start mt-4 text-lg h-12">
							{project?.projectName}
						</p>
						<p className="h-full text-left text-wrap overflow-hidden">
							{project?.projectDescription}
						</p>
						<div className="absolute bottom-3 overflow-hidden">
							<p className="inline text-left w-full">
								{project.created_byName}{" "}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
