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
	projectId: z.string(),
	description: z.string(),
});

export function EditDescription({
	projectId,
	description,
}: { projectId: string; description: string }): React.JSX.Element {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projectId: projectId,
			description: description,
		},
	});
	if (projectId === "") {
		return <div>Project not found</div>;
	}
	const changeDescription = api.project.editProjectDescription.useMutation({
		onSuccess: () => {
			toast("Your image has been changed successfully.");
			form.reset();
		},
		onError: () => {
			toast("Image Change Failed");
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await changeDescription.mutateAsync({
			projectId: projectId,
			projectDescription: values.description ?? "",
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
			<DialogContent className="sm:max-w-md bg-white">
				<DialogHeader>
					<DialogTitle>Change Description</DialogTitle>
					<DialogDescription>Enter a project description.</DialogDescription>
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
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
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
