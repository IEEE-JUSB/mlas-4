"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // =========================
  // Form States
  // =========================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // =========================
  // Password Criteria
  // =========================

  const passwordChecks = {
    length: /.{8,}/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  // Number of criteria fulfilled
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  // =========================
  // Password Strength
  // =========================
  //
  // 0-3  -> Weak
  // 4    -> Medium
  // 5    -> Strong
  //
  // Signup is allowed ONLY at Strong.
  // =========================

  let strengthLabel = "Weak";

  if (passwordStrength >= 5) {
    strengthLabel = "Strong";
  } else if (passwordStrength >= 4) {
    strengthLabel = "Medium";
  } else {
    strengthLabel = "Weak";
  }

  // =========================
  // 3-Level Progress Bar
  // =========================
  //
  // 0-3 criteria -> 33%
  // 4 criteria   -> 66%
  // 5 criteria   -> 100%
  // =========================

  const strengthWidth =
    passwordStrength >= 5
      ? "100%"
      : passwordStrength >= 4
        ? "66%"
        : passwordStrength > 0
          ? "33%"
          : "0%";

  const strengthColor =
    passwordStrength >= 5
      ? "bg-green-500"
      : passwordStrength >= 4
        ? "bg-yellow-500"
        : "bg-red-500";

  // =========================
  // Password Match
  // =========================

  const passwordsMatch =
    repeatPassword.length > 0 && password === repeatPassword;

  const passwordsDoNotMatch =
    repeatPassword.length > 0 && password !== repeatPassword;

  // =========================
  // Password Requirement Component
  // =========================

  const Requirement = ({
    fulfilled,
    children,
  }: {
    fulfilled: boolean;
    children: React.ReactNode;
  }) => (
    <span
      className={cn(
        "flex items-center gap-1",
        fulfilled ? "text-green-500" : "text-red-500"
      )}
    >
      {fulfilled ? (
        <Check className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <X className="h-3.5 w-3.5 shrink-0" />
      )}

      {children}

      {!fulfilled && (
        <span className="font-semibold">
          Required
        </span>
      )}
    </span>
  );

  // =========================
  // Sign Up
  // =========================

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    setIsLoading(true);
    setError(null);

    // =========================
    // Password Strength Validation
    // =========================
    //
    // Strong means ALL 5 criteria
    // must be fulfilled.
    // =========================

    if (passwordStrength < 5) {
      setError(
        "Please fulfill all password requirements before creating your account."
      );

      setIsLoading(false);
      return;
    }

    // =========================
    // Password Match Validation
    // =========================

    if (password !== repeatPassword) {
      setError("Passwords do not match.");

      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,

        options: {
          emailRedirectTo: `${window.location.origin}/protected`,

          data: {
            name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">

        {/* =========================
            Header
        ========================= */}

        <CardHeader className="space-y-2 pb-5">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create Account
          </CardTitle>

          <CardDescription>
            Create a new account to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-5">

              {/* =========================
                  Full Name
              ========================= */}

              <div className="grid gap-2">
                <Label htmlFor="name">
                  Full Name
                </Label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                  />
                </div>
              </div>

              {/* =========================
                  Email
              ========================= */}

              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                  />
                </div>
              </div>

              {/* =========================
                  Password
              ========================= */}

              <div className="grid gap-2">
                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative">

                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      // Clear generic error while user fixes password
                      if (error) {
                        setError(null);
                      }
                    }}
                    className="h-12 rounded-xl pl-10 pr-10"
                  />

                  {/* Password Eye */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

                {/* =========================
                    Password Strength
                ========================= */}

                {password.length > 0 && (
                  <div className="mt-1 space-y-2">

                    {/* Strength Label */}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Password strength
                      </span>

                      <span
                        className={cn(
                          "text-xs font-semibold",
                          passwordStrength >= 5
                            ? "text-green-500"
                            : passwordStrength >= 4
                              ? "text-yellow-500"
                              : "text-red-500"
                        )}
                      >
                        {strengthLabel}
                      </span>
                    </div>

                    {/* =========================
                        3-Level Progress Bar
                    ========================= */}

                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          strengthColor
                        )}
                        style={{
                          width: strengthWidth,
                        }}
                      />
                    </div>

                    {/* =========================
                        Password Requirements
                    ========================= */}

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-xs">

                      <Requirement
                        fulfilled={passwordChecks.length}
                      >
                        8+ characters
                      </Requirement>

                      <Requirement
                        fulfilled={passwordChecks.uppercase}
                      >
                        Uppercase
                      </Requirement>

                      <Requirement
                        fulfilled={passwordChecks.lowercase}
                      >
                        Lowercase
                      </Requirement>

                      <Requirement
                        fulfilled={passwordChecks.number}
                      >
                        Number
                      </Requirement>

                      <Requirement
                        fulfilled={passwordChecks.special}
                      >
                        Special character
                      </Requirement>

                    </div>

                    {/* =========================
                        Strong Password Message
                    ========================= */}

                    {passwordStrength === 5 && (
                      <p className="flex items-center gap-1 pt-1 text-xs font-medium text-green-500">
                        <Check className="h-3.5 w-3.5" />
                        Strong password — ready to use.
                      </p>
                    )}

                  </div>
                )}
              </div>

              {/* =========================
                  Confirm Password
              ========================= */}

              <div className="grid gap-2">
                <Label htmlFor="repeat-password">
                  Confirm Password
                </Label>

                <div className="relative">

                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) =>
                      setRepeatPassword(e.target.value)
                    }
                    className={cn(
                      "h-12 rounded-xl pl-10",
                      passwordsMatch &&
                        "border-green-500 focus-visible:ring-green-500",
                      passwordsDoNotMatch &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />

                </div>

                {/* Password Match Message */}

                {passwordsMatch && (
                  <p className="flex items-center gap-1 text-xs text-green-500">
                    <Check className="h-3.5 w-3.5" />
                    Passwords match
                  </p>
                )}

                {passwordsDoNotMatch && (
                  <p className="text-xs text-red-500">
                    Passwords do not match
                  </p>
                )}

              </div>

              {/* =========================
                  Error
              ========================= */}

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                </div>
              )}

              {/* =========================
                  Create Account
              ========================= */}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30"
              >
                {isLoading
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>

            </div>

            {/* =========================
                Login Link
            ========================= */}

            <div className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}

              <Link
                href="/auth/login"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}