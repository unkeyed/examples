import { api, HydrateClient } from "~/trpc/server";
import Image from "next/image";
import { TRPCError } from "@trpc/server";
import type { ProjectSchema } from "~/lib/types";
import PageTitle from "~/app/components/pageTitle";

export default async function Page({
	params,
}: { params: { projectId: string } }) {
	const res = await api.project.getProjectById({
		projectId: params.projectId,
	});
	const project = res instanceof TRPCError ? null : res;

	const stepList = await api.step.getStepByProjectId({
		projectId: project ? project.id : "",
	});

	return (
		<HydrateClient>
			<div className="flex flex-col w-full h-full bg-[url('/images/SL-031520-28970-33.jpg')]">
				<div className="flex flex-row w-full">
					<PageTitle title={project?.projectName ?? ""} />
				</div>
				<div className="w-full flex flex-col px-4 mt-2 ">
					<div className="flex flex-row max-h-96 items-start [&>*]:text-slate-900 justify-center pt-4 pb-8 bg-white w-full p-4 mx-auto rounded-lg shadow-lg shadow-slate-800 border border-slate-400 ">
						<div className="flex flex-col shrink w-1/2 ">
							<div className="relative">
								<Image
									className="aspect-w-16 aspect-h-9 "
									src={project?.projectImage ?? ""}
									alt="Project Image"
									width={1920}
									height={1080}
								/>
							</div>
						</div>
						<div className="flex flex-col w-full">
							<div className=" gap-4 pl-6">
								<p className="my-auto font-semibold">Project Name:</p>
								<p className="my-auto ml-4">{project?.projectName}</p>
							</div>

							<div className="relative mt-4 gap-4 pl-6">
								<p className="my-auto font-semibold">Category:</p>
								<p className="my-auto ml-4">{project?.category}</p>
							</div>
							<div className="mt-6 gap-4 pl-6">
								<p className="font-semibold text-nowrap">
									Project Description:
								</p>
								<p className="ml-4 my-auto text-wrap break-words">
									{project?.projectDescription}
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col mt-4 bg-white rounded-lg pt-8 shadow-lg shadow-slate-800 border border-slate-400">
						{stepList.map((step) => {
							return (
								<div key={step.id} className="flex flex-col mt-2 pl-6 gap-1">
									<p className="font-semibold text-nowrap text-xl">
										{step.title}
									</p>

									<div className="inline-flex content-center gap-4">
										{step.stepImage ? (
											<Image
												className="mt-8 ml-4 mb-4"
												src={step?.stepImage}
												alt="Step Image"
												width={500}
												height={300}
											/>
										) : null}
									</div>

									<div className="inline-flex content-center">
										<p className="ml-4 text-wrap break-words">
											{step.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</HydrateClient>
	);
}
