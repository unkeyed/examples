"use client";
import { api } from "~/trpc/react";
import { Edit2Icon, SaveIcon } from "lucide-react";
import { Button } from "~/app/components/ui/button";
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "~/app/components/ui/form";
import { Input } from "~/app/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

export const dynamic = "force-dynamic";
const formSchema = z.object({
	projectId: z.string(),
	projectName: z.string(),
});

type Props = {
	projectId: string;
	name: string;
};

export const UpdateProjectName: React.FC<Props> = ({ projectId, name }) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "all",
		shouldFocusError: true,
		delayError: 100,
		defaultValues: {
			projectId: projectId,
			projectName: name,
		},
	});
	const updateName = api.project.editProjectName.useMutation({
		onSuccess() {
			toast.success("Project name updated");
			router.refresh();
		},
		onError(err) {
			console.error(err);
			toast(err.message);
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await updateName.mutateAsync({
			projectId: values.projectId,
			projectName: values.projectName,
		});
		if (!res) {
			toast("Failed to change project image.");
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
					<DialogTitle>Change name</DialogTitle>
					<DialogDescription>Please choose a new name.</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="projectName"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input id="projectName" {...field} type="text" />
											</FormControl>
											<FormMessage className="mt-4 text-red-600" />
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
							variant="default"
							className="shadow shadow-slate-600"
						>
							Cancel
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
