import { Input } from "@/components/ui/input";
import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { sendOTP } from "@/app/actions/send/action";
import { EmailCode } from "./email-otp";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
const initialState = {
  success: false,
  statusCode: 0,
};

async function submitEmail(formData: FormData) {
  "use server";

  const results = await sendOTP(formData);

  if (results.statusCode === 201) {
    redirect(`/otp?email=${formData.get("email")}`);
  }
}
export function EmailSignIn() {
  return (
    <>
      <form className="grid gap-2" action={submitEmail}>
        <div className="grid gap-1">
          <Input
            name="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            required
            className="h-10 text-white duration-500 bg-transparent focus:text-black border-white/20 focus:bg-white focus:border-white hover:bg-white/20 hover:border-white/40 placeholder:white/20 "
          />
        </div>
        <SubmitButton buttonTitle="Sign In With Email" />
      </form>
    </>
  );
}
