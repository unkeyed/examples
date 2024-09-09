"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/app/components/ui/button";
import { Bot } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

const formSchema = z.object({
	projectId: z.string(),
	category: z.string(),
});

export function EditCategory({
	projectId,
}: { projectId: string }): React.JSX.Element {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projectId: projectId,
			category: undefined,
		},
	});
	if (projectId === "") {
		return <div>Project not found</div>;
	}
	const changeCategory = api.project.editProjectCategory.useMutation({
		onSuccess: () => {
			toast("Your image has been changed successfully.");
			form.reset();
		},
		onError: () => {
			toast("Image Change Failed");
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await changeCategory.mutateAsync({
			projectId: projectId,
			category: values.category ?? "",
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
					<DialogTitle>Change Category</DialogTitle>
					<DialogDescription>Please choose a new category.</DialogDescription>
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
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<Select
												
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="shadow-inner shadow-slate-200 bg-slate-300/30">
														<SelectValue placeholder="Select a category"/>
													</SelectTrigger>
												</FormControl>
												<SelectContent className="shadow-inner shadow-slate-200 bg-slate-200">
													<SelectItem value="Art">Art</SelectItem>
													<SelectItem value="Cosplay">Cosplay</SelectItem>
													<SelectItem value="Coding">Coding</SelectItem>
													<SelectItem value="Robotics">Robotics</SelectItem>
													<SelectItem value="Electronics">
														Electronics
													</SelectItem>
													<SelectItem value="Tools">Tools</SelectItem>
													<SelectItem value="Woodworking">
														Woodworking
													</SelectItem>
													<SelectItem value="Mechanical">Mechanical</SelectItem>
													<SelectItem value="Other">Other</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
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
