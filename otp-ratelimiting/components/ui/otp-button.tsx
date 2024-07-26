"use client";
import { useToast } from "./use-toast";
import { sendOTP } from "@/app/actions/send/action";
export const OTPButton = ({ email }: { email: string }) => {
  const { toast } = useToast();
  return (
    <button
      type="button"
      className="text-white"
      onClick={async () => {
        const formData = new FormData();
        // this shouldn't happen but they could land on the otp page;
        if (email.length > 0) {
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
  );
};
