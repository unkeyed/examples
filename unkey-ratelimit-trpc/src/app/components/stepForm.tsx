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
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/toaster";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@radix-ui/react-dialog";
import {
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { SaveIcon } from "lucide-react";

const ACCEPTED_IMAGE_TYPES = ["image/*,.jpeg", "image/*,.jpg", "image/*,.png"];
const formSchema = z.object({
	title: z.string().min(2).max(50),
	description: z
		.string()
		.min(10, { message: "Must be 10 or more characters long" })
		.max(500, { message: "Must be 500 or less characters long" }),
	projectId: z.string(),
	stepNumber: z.number(),
	image: z
		.instanceof(File)
		.refine(
			(file) => !ACCEPTED_IMAGE_TYPES.includes(file?.type),
			"Only .jpg, .jpeg and .png formats are supported.",
		)
		.optional(),
});
type ProjectType = {
	projectId: string;
	stepCount: number;
};
export function StepForm({
	project,
}: { project: ProjectType }): React.JSX.Element {
	const [stepImage, setStepImage] = useState<string>();
	const [stepNumber, setStepNumber] = useState<number>(project.stepCount + 1);
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const createStep = api.step.create.useMutation({
		onSuccess: () => {
			toast("Your step has been created successfully.");
			form.reset();
		},
		onError: (error) => {
			toast(`Step Creation Failed ${error.message}`);
		},
	});
	if (project.projectId === undefined) {
		return <div>Project ID is undefined</div>;
	}
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			stepNumber: stepNumber,
			projectId: project.projectId,
			image: undefined,
		},
	});

	async function handleImageChange(fileList: FileList): Promise<string> {
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
		res.then((imageFile) => {
			setStepImage(imageFile);
		});
		return res;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await createStep.mutateAsync({
			title: values.title,
			description: values.description,
			stepNumber: values.stepNumber,
			projectId: values.projectId,
			image: stepImage,
		});
		setStepNumber(stepNumber + 1);
		setOpen(false);
		router.refresh();
		form.reset();
		form.setValue("title", "");
		form.setValue("description", "");
		form.setValue("image", undefined);
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					className="mt-4 bg-white text-black h-22 w-22 px-2 rounded-lg shadow-md shadow-slate-600 border border-slate-400"
				>
					Add Step
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md bg-white">
				<DialogHeader>
					<DialogTitle>Add Step</DialogTitle>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<hr className="border border-white/10" />
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="title">Title</FormLabel>
											<FormControl>
												<Input 
												id="title"
												placeholder="Title" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<hr className="border border-white/10" />
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="description">Description</FormLabel>
											<Textarea
											id="description"
												placeholder="Description"
												{...field}
												className="to-slate-900"
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
								<hr className="border border-white/10" />
								<div className="flex flex-row gap-6 pt-4">
									<FormField
										control={form.control}
										name="image"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor="image">Step Image</FormLabel>
												<FormControl>
													<Input
														id="image"
														multiple={false}
														onChange={(e) =>
															handleImageChange(e.target.files as FileList)
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
								<Button
									type="submit"
									size="sm"
									className="absolute bottom-6 right-8 px-3shadow shadow-slate-600 inline-block"
								>
									<span className="my-auto font-semibold text-base">Save</span>
									<SaveIcon className="h-4 w-4 inline ml-2 my-auto mb-1" />
								</Button>
							</form>
						</Form>
					</div>
				</div>
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button
							type="button"
							variant="secondary"
							className="shadow shadow-slate-600 bg-slate-200 text-base"
						>
							Cancel
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
