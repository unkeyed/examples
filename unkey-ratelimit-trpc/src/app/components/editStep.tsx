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
import { api } from "~/trpc/react";
import { useState } from "react";
import { toast } from "./ui/toaster";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Edit2Icon, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
const formSchema = z.object({
	stepId: z.string(),
	stepTitle: z.string(),
	stepDescription: z.string(),
});

export function EditStep({
	stepId,
	stepDescription,
	stepTitle,
}: {
	stepId: string;
	stepDescription: string;
	stepTitle: string;
}): React.JSX.Element {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			stepId: stepId,
			stepTitle: stepTitle,
			stepDescription: stepDescription,
		},
	});
	if (stepId === "") {
		return <div>Step not found</div>;
	}
	const editStep = api.step.editStep.useMutation({
		onSuccess: () => {
			toast("Your step has been edited successfully.");
			form.reset();
		},
		onError: (error) => {
			toast(`Step editing Failed ${error.message}`);
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await editStep.mutateAsync({
			stepId: values.stepId,
			stepTitle: values.stepTitle,
			stepDescription: values.stepDescription ?? "",
		});
		if (!res) {
			toast("Failed to change project category.");
			return;
		}
		router.refresh();
		setOpen(false);
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					className="absolute top-2 right-4 bg-white h-22 w-22 px-2 rounded-xl shadow-md shadow-slate-600 border border-slate-400"
				>
					<Edit2Icon className="" size={14} />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md bg-white" aria-describedby={"Add step form"}>
				<DialogHeader>
					<DialogTitle>Edit step</DialogTitle>
					<DialogDescription>Make any changes you see fit</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<hr className="border border-white/10" />
								{/* Project Name */}
								<FormField
									control={form.control}
									name="stepTitle"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="title">Title</FormLabel>
											<FormControl>
												<Input
													id="title"
													{...field}
													className="shadow-inner shadow-slate-200 bg-slate-300/30"
												/>
											</FormControl>
											<FormMessage className="relative mt-4 text-red-600" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="stepDescription"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="description">Description</FormLabel>
											<FormControl>
												<Textarea
												id="description"
													placeholder="Project Description"
													{...field}
													className="shadow-inner shadow-slate-200 bg-slate-300/30"
												/>
											</FormControl>
											<FormMessage className="relative mt-4 text-red-600" />
										</FormItem>
									)}
								/>
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
