"use client";

import { OTPInput, type SlotProps } from "input-otp";
import * as React from "react";

import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";

import { useFormState, useFormStatus } from "react-dom";
import { sendOTP } from "@/app/actions/send/action";
import { useRouter, useSearchParams } from "next/navigation";

const initialState = {
  success: false,
  statusCode: 0,
};

export const EmailCode: React.FC = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = React.useState(false);
  const verifyCode = async (otp: string) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // This is where you would verify the code but...for this purpose we will just show you a success.
    toast({
      title: "Code successfully verfified",
      description: "Thanks for testing our demo",
    });
  };

  const [otp, setOtp] = React.useState("");

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
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          className="text-white"
          onClick={async () => {
            const formData = new FormData();
            // this shouldn't happen but they could land on the otp page;
            if (email) {
              formData.append("email", email);
            }
            const resendOTP = await sendOTP(formData);
            if (resendOTP.statusCode === 201) {
              toast({
                title: "Success",
                description: "We sent you a new OTP",
              });
            }
            if (resendOTP.statusCode > 201) {
              toast({
                title: "Error",
                description: resendOTP.error,
                variant: "destructive",
              });
            }
          }}
        >
          Resend
        </button>
      </p>
      <form
        className="flex flex-col gap-12 mt-10"
        onSubmit={() => verifyCode(otp)}
      >
        <OTPInput
          data-1p-ignore
          value={otp}
          onChange={setOtp}
          onComplete={() => verifyCode(otp)}
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

        <button
          type="submit"
          className="flex items-center justify-center h-10 gap-2 px-4 text-sm font-semibold text-black duration-200 bg-white border border-white rounded-lg hover:border-white/30 hover:bg-black hover:text-white"
          disabled={isLoading}
          onClick={() => verifyCode(otp)}
        >
          {isLoading ? <Loading className="w-4 h-4 mr-2 animate-spin" /> : null}
          Continue
        </button>
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
