import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { ProjectCard } from "./components/projectCard";
import PageTitle from "./components/pageTitle";
import type { ProjectSchema } from "~/lib/types";
export default async function Home() {
	type ProjectSchemaList = ProjectSchema[];
	const session = await getServerAuthSession();
	if (!session) {
		return redirect("/api/auth/signin");
	}
	const res = await api.project.getLatestProjects({
		limit: 10,
	});
	const projectList = res instanceof TRPCError ? null : res;

	return session?.user ? (
		<div className="flex flex-col w-full h-full bg-[url('/images/SL-031520-28970-33.jpg')]">
			<PageTitle title="Recent Projects" />

			<div className="flex flex-row w-full flex-wrap p-8 gap-6 mx-auto justify-center">
				{projectList?.map((project) => {
					return (
						<div key={project.id} className="flex flex-col w-1/5">
							<ProjectCard project={project} />
						</div>
					);
				})}
			</div>
		</div>
	) : (
		redirect("/api/auth/signin")
	);
}
