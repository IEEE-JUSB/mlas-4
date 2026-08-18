import Link from "next/link";
import { MailCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-transparent/5 dark:bg-transparent-5 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-6 text-center">
            {/* Email Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700">
              <MailCheck className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Check Your Email
              </CardTitle>

              <CardDescription className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Your account has been created successfully.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Message */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 text-center">
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                We&apos;ve sent a confirmation link to your email address.
                Please open the email and click the verification link to
                activate your account.
              </p>
            </div>

            {/* Important Note */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 p-4">
              <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
                You must verify your email before signing in.
              </p>
            </div>

            {/* Login Button */}
            <Button
              asChild
              className="h-11 w-full rounded-xl font-semibold shadow-lg transition-all hover:-translate-y-0.5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Link href="/login">Go to Login</Link>
            </Button>

            {/* Help text */}
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              Didn&apos;t receive the email? Check your spam or junk folder.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}