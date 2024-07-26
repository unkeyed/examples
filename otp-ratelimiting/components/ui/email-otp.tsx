"use client";
import { OTPInput, type SlotProps } from "input-otp";
import * as React from "react";

import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";

import { useFormState, useFormStatus } from "react-dom";
import { verifyOTP } from "@/app/actions/verify/action";
import { useSearchParams } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { OTPButton } from "./otp-button";

const initialState = {
  statusCode: 0,
  success: false,
  error: "",
};

export const EmailCode: React.FC = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [state, formAction] = useFormState(verifyOTP, initialState);

  React.useEffect(() => {
    if (state.statusCode === 200) {
      toast({
        title: "Woo!",
        description: "Verified, keep trying to see our ratelimit",
      });
    }
    if (state.statusCode > 200) {
      toast({
        title: "Oh No!",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="flex flex-col max-w-sm mx-auto text-left">
      <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">
        Security code sent!
      </h1>
      <p className="mt-4 text-sm text-white/40">
        To continue, please enter the 6 digit verification code sent to the
        provided email.
      </p>

      <p className="mt-2 text-sm text-white/40">
        Didn&apos;t receive the code? <OTPButton email={email} />
      </p>
      <form className="flex flex-col gap-12 mt-10" action={formAction}>
        <OTPInput
          data-1p-ignore
          name="code"
          onComplete={() => {}}
          maxLength={6}
          render={({ slots }) => (
            <div className="flex items-center justify-between">
              {slots.slice(0, 3).map((slot, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: I have nothing better
                <Slot key={idx} {...slot} />
              ))}
              <Minus className="w-6 h-6 text-white/15" />
              {slots.slice(3).map((slot, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: I have nothing better
                <Slot key={idx} {...slot} />
              ))}
            </div>
          )}
        />

        <SubmitButton buttonTitle="Continue" />
      </form>
    </div>
  );
};

const Slot: React.FC<SlotProps> = (props) => (
  <div
    className={cn(
      "relative w-10 h-12 text-[2rem] border border-white/20 rounded-lg text-white font-light text-base",
      "flex items-center justify-center",
      "transition-all duration-300",
      "group-hover:border-white/50 group-focus-within:border-white/50",
      "outline outline-0 outline-white",
      { "outline-1 ": props.isActive },
    )}
  >
    {props.char !== null && <div>{props.char}</div>}
  </div>
);
