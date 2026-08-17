import Image from "next/image";
import { AuthForm } from "@/components/auth-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full">
      {/* Left Side - IEEE JUSB MLAS Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[#111827] p-6 xl:p-10">
        <div className="relative h-full min-h-[calc(100svh-3rem)] w-full overflow-hidden">
          <Image
            src="/images/ieee-jusb-mlas.jpeg"
            alt="IEEE JUSB MLAS 4.0"
            fill
            priority
            sizes="50vw"
            className="object-contain"
          />

          {/* Smooth transition between image and background */}
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#111827] to-transparent" />
        </div>
      </div>

      {/* Right Side - Login/Register Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
