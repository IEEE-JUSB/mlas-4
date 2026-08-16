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
        <Card className="border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-6 text-center">
            {/* Email Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <MailCheck className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                Check Your Email
              </CardTitle>

              <CardDescription className="text-sm leading-6">
                Your account has been created successfully.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Message */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-center">
              <p className="text-sm leading-6 text-muted-foreground">
                We&apos;ve sent a confirmation link to your email address.
                Please open the email and click the verification link to
                activate your account.
              </p>
            </div>

            {/* Important Note */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-center text-muted-foreground">
                You must verify your email before signing in.
              </p>
            </div>

            {/* Login Button */}
            <Button
              asChild
              className="h-11 w-full rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30"
            >
              <Link href="/auth/login">Go to Login</Link>
            </Button>

            {/* Help text */}
            <p className="text-center text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam or junk folder.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
