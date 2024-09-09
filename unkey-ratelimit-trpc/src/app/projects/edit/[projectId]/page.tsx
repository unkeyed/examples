import { api, HydrateClient } from "~/trpc/server";
import Image from "next/image";
import { TRPCError } from "@trpc/server";
import PageTitle from "~/app/components/pageTitle";
import { EditImage } from "~/app/components/editImage";
import { UpdateProjectName } from "~/app/components/updateProjectName";
import { Separator } from "~/app/components/ui/separator";
import { EditCategory } from "~/app/components/editCategory";
import { EditDescription } from "~/app/components/editDescription";
import { EditStep } from "~/app/components/editStep";
import { EditStepImage } from "~/app/components/editStepImage";
import { StepForm } from "~/app/components/stepForm";

export default async function Page({
	params,
}: { params: { projectId: string } }) {
	const res = await api.project.getProjectById({
		projectId: params.projectId,
	});
	const project = res instanceof TRPCError ? null : res;
	const steps = project?.steps;

	return (
		<HydrateClient>
			<div className="flex flex-col w-full h-full bg-[url('/images/SL-031520-28970-33.jpg')]">
				<div className="flex flex-row w-full">
					<PageTitle title={project?.projectName ?? ""} />
				</div>
				<div className="w-full flex flex-col px-4 mt-2">
					<div className="flex flex-row items-start [&>*]:text-slate-900 justify-center pt-4 pb-8 bg-white w-full p-4 mx-auto rounded-lg shadow-lg shadow-slate-600 border border-slate-400">
						{project?.projectImage ? (
							<div className="flex flex-col shrink w-1/2 object-contain">
								<div className="relative overflow-hidden w-full h-80">
									<Image
										className="aspect-w-16 aspect-h-9 shrink object-fit"
										src={project?.projectImage ?? ""}
										alt="Project Image"
										width={1920}
										height={1080}
									/>
									<EditImage projectId={project?.id ?? ""} />
								</div>
							</div>
						) : null}
						<div className="flex flex-col w-full gap-4">
							<div className="relative pl-6">
								<p className="font-semibold">Project Name:</p>
								<p className="ml-4">{project?.projectName}</p>
								<UpdateProjectName
									projectId={params.projectId}
									name={project?.projectName ?? ""}
								/>
							</div>
							<div className="mx-8 mt-0 pt-0">
								<Separator />
							</div>

							<div className="relative pl-6">
								<p className="my-auto font-semibold">Category:</p>
								<p className="my-auto ml-4">
									{project?.category
										? project.category.charAt(0) +
											project.category.substring(1).toLowerCase()
										: null}
								</p>
								<EditCategory projectId={project?.id ?? ""} />
							</div>
							<div className="mx-8">
								<Separator />
							</div>
							<div className="relative pl-6">
								<p className="font-semibold text-nowrap">
									Project Description:
								</p>
								<p className="ml-4 my-auto text-wrap break-words">
									{project?.projectDescription}
								</p>
								<EditDescription
									projectId={project?.id ?? ""}
									description={project?.projectDescription ?? ""}
								/>
							</div>
						</div>
					</div>
					<StepForm
						project={{
							projectId: project?.id ?? "",
							stepCount: steps?.length ?? 0,
						}}
					/>
					<div className="flex flex-col mt-4 bg-white rounded-lg pt-8 shadow-lg shadow-slate-600 border border-slate-400">
						<div className="relaltive">
							{steps
								? steps?.map((step) => {
										return (
											<div key={step.id} className="relative mt-2 pl-6 gap-1">
												<p className="font-semibold text-nowrap text-xl">
													{step.title}
												</p>
												<p className="ml-4 text-wrap break-words">
													{step.description}
												</p>
												<EditStep
													stepId={step.id}
													stepTitle={step.title ?? ""}
													stepDescription={step.description}
												/>
												{step.stepImage ? (
													<div className="relative w-fit">
														<Image
															className="mt-8 ml-4 mb-6"
															src={step?.stepImage}
															alt="Step Image"
															width={500}
															height={300}
														/>
														<EditStepImage stepId={step.id} />
													</div>
												) : null}

												<div className="mx-8 mt-4">
													<Separator />
												</div>
											</div>
										);
									})
								: null}
						</div>
					</div>
				</div>
			</div>
		</HydrateClient>
	);
}
