import { EmailSignIn } from "@/components/ui/email-login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="bg-black">
        <nav className="container flex items-center justify-between h-16">
          <Link href="/">
            <Logo className="min-w-sm" />
          </Link>
          <Link
            className="flex items-center h-8 gap-2 px-4 text-sm text-white duration-500 border rounded-lg bg-white/5 hover:bg-white hover:text-black border-white/10"
            href="/docs"
            target="_blank"
          >
            <FileText className="w-4 h-4" strokeWidth={1} />
            Documentation
          </Link>
        </nav>
        <div className="flex min-h-screen pt-16 -mt-16">
          <div className="container relative flex flex-col items-center justify-center gap-8 lg:w-2/5">
            <div className="w-full max-w-sm">
              {" "}
              <EmailSignIn />
            </div>
          </div>
          <Separator
            orientation="vertical"
            className="hidden -mt-16 bg-white/20 lg:block"
          />
          <div className="items-center justify-center hidden w-3/5 h-[calc(100vh-4rem)] lg:flex">
            <div className="relative max-w-lg pl-12">
              <div className="absolute top-0 left-0 w-px bg-white/30 h-1/2" />
              <div className="absolute bottom-0 left-0 w-px bg-white h-1/2" />

              <p className="text-3xl leading-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 text-pretty">
                This is protected by Unkey, try sending yourself a code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="93"
    height="40"
    viewBox="0 0 93 40"
  >
    <path
      d="M10.8 30.3C4.8 30.3 1.38 27.12 1.38 21.66V9.9H4.59V21.45C4.59 25.5 6.39 27.18 10.8 27.18C15.21 27.18 17.01 25.5 17.01 21.45V9.9H20.25V21.66C20.25 27.12 16.83 30.3 10.8 30.3ZM26.3611 30H23.1211V15.09H26.0911V19.71H26.3011C26.7511 17.19 28.7311 14.79 32.5111 14.79C36.6511 14.79 38.6911 17.58 38.6911 21.03V30H35.4511V21.9C35.4511 19.11 34.1911 17.7 31.1011 17.7C27.8311 17.7 26.3611 19.38 26.3611 22.62V30ZM44.8181 30H41.5781V9.9H44.8181V21H49.0781L53.5481 15.09H57.3281L51.7181 22.26L57.2981 30H53.4881L49.0781 23.91H44.8181V30ZM66.4219 30.3C61.5319 30.3 58.3219 27.54 58.3219 22.56C58.3219 17.91 61.5019 14.79 66.3619 14.79C70.9819 14.79 74.1319 17.34 74.1319 21.87C74.1319 22.41 74.1019 22.83 74.0119 23.28H61.3519C61.4719 26.16 62.8819 27.69 66.3319 27.69C69.4519 27.69 70.7419 26.67 70.7419 24.9V24.66H73.9819V24.93C73.9819 28.11 70.8619 30.3 66.4219 30.3ZM66.3019 17.34C63.0019 17.34 61.5619 18.81 61.3819 21.48H71.0719V21.42C71.0719 18.66 69.4819 17.34 66.3019 17.34ZM78.9586 35.1H76.8286V32.16H79.7386C81.0586 32.16 81.5986 31.8 82.0486 30.78L82.4086 30L75.0586 15.09H78.6886L82.4986 23.01L83.9686 26.58H84.2086L85.6186 22.98L89.1286 15.09H92.6986L84.9286 31.62C83.6986 34.29 82.0186 35.1 78.9586 35.1Z"
      fill="url(#paint0_radial_301_76)"
    />
    <defs>
      <radialGradient
        id="paint0_radial_301_76"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(23.2729) scale(101.237 101.088)"
      >
        <stop offset="0.26875" stopColor="white" />
        <stop offset="0.904454" stopColor="white" stopOpacity="0.5" />
      </radialGradient>
    </defs>
  </svg>
);
