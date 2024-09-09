"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/app/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/app/components/ui/form";
import { Input } from "~/app/components/ui/input";
import { z } from "zod";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./ui/toaster";

const ACCEPTED_IMAGE_TYPES = ["image/*,.jpeg", "image/*,.jpg", "image/*,.png"];
const formSchema = z.object({
	projectName: z.string().min(2).max(50),
	category: z.string().min(2).max(50),
	projectDescription: z
		.string()
		.min(10, { message: "Must be 10 or more characters long" })
		.max(500, { message: "Must be less than 500 characters long" }),
	projectImage: z
		.instanceof(File)
		.refine(
			(file) => !ACCEPTED_IMAGE_TYPES.includes(file?.type),
			"Only .jpg, .jpeg and .png formats are supported.",
		)
		.optional(),
});

export function ProjectForm(): React.JSX.Element {
	const [image, setImage] = useState<string>();
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projectName: "",
			category: undefined,
			projectDescription: "",
			projectImage: undefined,
		},
	});

	const createProject = api.project.create.useMutation({
		onSuccess: (data) => {
			toast("Your project has been created successfully.");
			router.push(`/projects/edit/${data.projectId}`);
			form.reset();
			form.setValue("category", "");
		},
		onError: (error) => {
			toast(`Project Creation Failed ${error.message}`);
		},
	});

	async function handleImageChange(fileList: FileList | null): Promise<string> {
		if (!fileList) {
			return "";
		}
		const res = new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			const file = fileList[0];
			if (file) {
				reader.readAsDataURL(file);
				reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
					if (readerEvent.target?.result) {
						const imageFile = reader.result as string;
						resolve(imageFile);
					} else {
						reject(new Error("Failed to read image file."));
					}
				};
			}
		});
		await res.then((imageFile) => {
			setImage(imageFile);
		});
		return res;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await createProject.mutateAsync({
			projectName: values.projectName,
			category: values.category,
			projectDescription: values.projectDescription,
			projectImage: image,
		});
	}

	return (
		<div className="mx-auto flex flex-col rounded-lg bg-white p-24 text-black">
			<h1 className="mb-6 text-4xl">New Project</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<hr className="border border-white/10" />
					{/* Project Name */}
					<FormField
						control={form.control}
						name="projectName"
						render={({ field }) => (
							// <div className="flex flex-col gap-4">
							<FormItem>
								<FormLabel>Project Name</FormLabel>
								<FormControl>
									<Input
										id="projectName"
										placeholder="Project Name"
										{...field}
										className="bg-slate-300/30 shadow-inner shadow-slate-200"
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<hr className="border border-white/10" />
					{/* Project Category */}
					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="bg-slate-300/30 shadow-inner shadow-slate-200">
											<SelectValue placeholder="Select a category " />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="bg-slate-200 shadow-inner shadow-slate-200">
										<SelectItem
											value="Art"
											className="active:bg-white hover:bg-white"
										>
											Art
										</SelectItem>
										<SelectItem
											value="Cosplay"
											className="active:bg-white hover:bg-white"
										>
											Cosplay
										</SelectItem>
										<SelectItem
											value="Coding"
											className="active:bg-white hover:bg-white"
										>
											Coding
										</SelectItem>
										<SelectItem
											value="Robotics"
											className="active:bg-white hover:bg-white"
										>
											Robotics
										</SelectItem>
										<SelectItem
											value="Electronics"
											className="active:bg-white hover:bg-white"
										>
											Electronics
										</SelectItem>
										<SelectItem
											value="Tools"
											className="active:bg-white hover:bg-white"
										>
											Tools
										</SelectItem>
										<SelectItem
											value="Woodworking"
											className="active:bg-white hover:bg-white"
										>
											Woodworking
										</SelectItem>
										<SelectItem
											value="Mechanical"
											className="active:bg-white hover:bg-white"
										>
											Mechanical
										</SelectItem>
										<SelectItem
											value="Other"
											className="active:bg-white hover:bg-white"
										>
											Other
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<hr className="border border-white/10" />
					{/* Project Description */}
					<FormField
						control={form.control}
						name="projectDescription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Project Description"
										{...field}
										className="bg-slate-300/30 shadow-inner shadow-slate-200"
									/>
								</FormControl>
								<FormMessage className="relative mt-4 text-red-600" />
							</FormItem>
						)}
					/>
					<hr className="border border-white/10" />
					{/* Project Image */}
					<div className="flex flex-row gap-6 pt-4">
						<FormField
							control={form.control}
							name="projectImage"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											id="projectImage"
											className="bg-slate-300/30 shadow-inner shadow-slate-200"
											multiple={false}
											onChange={(e) =>
												e.target.files
													? handleImageChange(e.target?.files as FileList)
													: null
											}
											type="file"
										/>
									</FormControl>
									<FormMessage className="mt-4 text-red-600" />
								</FormItem>
							)}
						/>
					</div>

					<hr className="border border-white/10" />
					<div className="flex w-full justify-end">
						<Button
							disabled={!form.formState.isValid}
							type="submit"
							className="items-end border border-slate-700 bg-slate-800 font-semibold text-white shadow-xl shadow-slate-200 disabled:border-red-600"
						>
							Next
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
