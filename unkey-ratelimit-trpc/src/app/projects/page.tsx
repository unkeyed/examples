import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { ProjectCard } from "../components/projectCard";
import Link from "next/link";
import PageTitle from "../components/pageTitle";
import { FilePlus2 } from "lucide-react";
export default async function Page() {
	const projects = await api.project.getUserProjects();
	const session = await getServerAuthSession();
	return (
		<HydrateClient>
			<div className="flex flex-col w-full bg-[url('/images/SL-031520-28970-33.jpg')]">
				
					<PageTitle title="Projects" />
			
				{session?.user ? (<div className="flex justify-start ml-12 mt-12">
					<Link
						href="/projects/create"
						className="flex flex-row rounded-full px-4 py-1.5 border border-slate-900 shadow-md shadow-slate-600 hover:scale-105 bg-white"
					>
						<p className=" text-lg font-semibold my-auto">Create New</p>
						<FilePlus2 size={32} className="inline ml-6 text-violet-800" />
					</Link>
				</div>) : (<Link href="/api/auth/signin">Sign in</Link>)}
				
				{session?.user ? (
					<div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 text-center gap-10 justify-center text-slate-900 w-full mt-6 p-8">
						{projects.map((project) => (
							<ProjectCard
								key={project.id.substring(0, 8)}
								project={project}
							/>
						))}
					</div>
				) : (
					<p>Guest</p>
				)}
			</div>
		</HydrateClient>
	);
}
