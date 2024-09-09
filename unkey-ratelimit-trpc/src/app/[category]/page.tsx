import { TRPCError } from "@trpc/server";
import { api } from "~/trpc/server";
import { ProjectCard } from "../components/projectCard";
import PageTitle from "../components/pageTitle";

export default async function Page({
	params,
}: { params: { category: string } }) {
	const res = await api.project.getProjectsByCategory({
		category: params.category,
	});
	const projectList = res instanceof TRPCError ? null : res;

	return (
		<div className="flex flex-col w-full bg-[url('/images/SL-031520-28970-33.jpg')]">
			<div className="flex flex-row w-full">
				<PageTitle title={params.category} />
			</div>
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
	);
}
