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
import { set, z } from "zod";
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

const ACCEPTED_IMAGE_TYPES = ["image/*,.jpeg", "image/*,.jpg", "image/*,.png"];
const formSchema = z.object({
	projectId: z.string(),
	image: z
		.instanceof(File)
		.refine(
			(file) => !ACCEPTED_IMAGE_TYPES.includes(file?.type),
			"Only .jpg, .jpeg and .png formats are supported.",
		)
		.optional(),
});

export function EditImage({
	projectId,
}: { projectId: string }): React.JSX.Element {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const [image, setImage] = useState<string>();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projectId: projectId,
			image: undefined,
		},
	});
	if (projectId === "") {
		return <div>Project not found</div>;
	}
	const changeImage = api.project.editProjectImage.useMutation({
		onSuccess: () => {
			toast("Your image has been changed successfully.");
			form.reset();
		},
		onError: () => {
			toast("Image Change Failed");
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
		const res = await changeImage.mutateAsync({
			projectId: projectId,
			image: image ?? "",
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
					className="absolute top-4 right-4 bg-white h-22 w-22 px-2 rounded-xl shadow-md shadow-slate-600 border border-slate-400"
				>
					<Edit2Icon className="" size={14} />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md bg-white">
				<DialogHeader>
					<DialogTitle>Replace Image</DialogTitle>
					<DialogDescription>Please choose a new image.</DialogDescription>
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
									name="image"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													id="image"
													className="shadow-inner shadow-slate-200 bg-slate-300/30"
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
}
