"use client";
import { useFormStatus } from "react-dom";
import { Loading } from "./loading";

export const SubmitButton = ({ buttonTitle }: { buttonTitle: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="flex items-center justify-center h-10 gap-2 px-4 text-sm font-semibold text-black duration-200 bg-white border border-white rounded-lg hover:border-white/30 hover:bg-black hover:text-white"
      disabled={pending}
    >
      {pending ? (
        <Loading className="w-4 h-4 animate-spin" />
      ) : (
        `${buttonTitle}`
      )}
    </button>
  );
};
