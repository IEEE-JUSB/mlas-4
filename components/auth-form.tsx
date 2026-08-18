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

import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
  User,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "login" | "register";

export function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // =========================
  // Auth Mode
  // =========================

  const [mode, setMode] = useState<AuthMode>("login");

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
  // Toggle Login / Register
  // =========================

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

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

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  // =========================
  // Password Strength Label
  // =========================

  let strengthLabel = "Weak";

  if (passwordStrength >= 5) {
    strengthLabel = "Strong";
  } else if (passwordStrength >= 4) {
    strengthLabel = "Medium";
  }

  // =========================
  // Password Progress Bar
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
  // Password Requirement
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
        fulfilled ? "text-green-500" : "text-red-500",
      )}
    >
      {fulfilled ? (
        <Check className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <X className="h-3.5 w-3.5 shrink-0" />
      )}

      {children}

      {!fulfilled && <span className="font-semibold">Required</span>}
    </span>
  );

  // =========================
  // Email + Password Login
  // =========================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // Google Login
  // =========================

  const handleGoogleLogin = async () => {
    const supabase = createClient();

    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  // =========================
  // Sign Up
  // =========================

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    setIsLoading(true);
    setError(null);

    // =========================
    // Password Strength
    // =========================

    if (passwordStrength < 5) {
      setError(
        "Please fulfill all password requirements before creating your account.",
      );

      setIsLoading(false);
      return;
    }

    // =========================
    // Password Match
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
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // Submit Handler
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    if (mode === "login") {
      await handleLogin(e);
    } else {
      await handleSignUp(e);
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-md", className)} {...props}>
      <Card className="border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
        {/* =========================
            Header
        ========================= */}

        <CardHeader
          className={cn(
            "space-y-4 text-center",
            mode === "login" ? "pb-6" : "pb-5",
          )}
        >
          {/* =========================
              Login / Register Toggle
          ========================= */}

          <div className="mx-auto flex w-full max-w-xs rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={cn(
                "flex-1 rounded-lg px-4 py-2.5 text-sm transition-all",
                mode === "login"
                  ? "bg-background font-semibold text-foreground shadow-sm"
                  : "font-medium text-muted-foreground hover:text-foreground",
              )}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("register")}
              className={cn(
                "flex-1 rounded-lg px-4 py-2.5 text-sm transition-all",
                mode === "register"
                  ? "bg-background font-semibold text-foreground shadow-sm"
                  : "font-medium text-muted-foreground hover:text-foreground",
              )}
            >
              Register
            </button>
          </div>

          {/* =========================
              Login Header
          ========================= */}

          {mode === "login" ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <LogIn className="h-7 w-7 text-primary" />
              </div>

              <CardTitle className="text-3xl font-bold tracking-tight">
                Welcome Back
              </CardTitle>

              <CardDescription className="text-sm text-muted-foreground">
                Login to continue to your account
              </CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <User className="h-7 w-7 text-primary" />
              </div>

              <CardTitle className="text-3xl font-bold tracking-tight">
                Create Account
              </CardTitle>

              <CardDescription className="text-sm text-muted-foreground">
                Create a new account to get started
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* ==================================================
                  REGISTER ONLY — Full Name
              ================================================== */}

              {mode === "register" && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>

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
              )}

              {/* =========================
                  Email
              ========================= */}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl pl-10 transition-all focus-visible:ring-2"
                  />
                </div>
              </div>

              {/* =========================
                  Password
              ========================= */}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>

                  {/* Login Only */}

                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => router.push("/auth/forgot-password")}
                      className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (error) {
                        setError(null);
                      }
                    }}
                    className="h-11 rounded-xl pl-10 pr-10 transition-all focus-visible:ring-2"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* ==================================================
                    REGISTER ONLY — Password Strength
                ================================================== */}

                {mode === "register" && password.length > 0 && (
                  <div className="mt-1 space-y-2">
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
                              : "text-red-500",
                        )}
                      >
                        {strengthLabel}
                      </span>
                    </div>

                    {/* Progress Bar */}

                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          strengthColor,
                        )}
                        style={{
                          width: strengthWidth,
                        }}
                      />
                    </div>

                    {/* Password Requirements */}

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-xs">
                      <Requirement fulfilled={passwordChecks.length}>
                        8+ characters
                      </Requirement>

                      <Requirement fulfilled={passwordChecks.uppercase}>
                        Uppercase
                      </Requirement>

                      <Requirement fulfilled={passwordChecks.lowercase}>
                        Lowercase
                      </Requirement>

                      <Requirement fulfilled={passwordChecks.number}>
                        Number
                      </Requirement>

                      <Requirement fulfilled={passwordChecks.special}>
                        Special character
                      </Requirement>
                    </div>

                    {/* Strong Password Message */}

                    {passwordStrength === 5 && (
                      <p className="flex items-center gap-1 pt-1 text-xs font-medium text-green-500">
                        <Check className="h-3.5 w-3.5" />
                        Strong password — ready to use.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ==================================================
                  REGISTER ONLY — Confirm Password
              ================================================== */}

              {mode === "register" && (
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Confirm Password</Label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className={cn(
                        "h-12 rounded-xl pl-10",
                        passwordsMatch &&
                          "border-green-500 focus-visible:ring-green-500",
                        passwordsDoNotMatch &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                    />
                  </div>

                  {/* Password Match */}

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
              )}

              {/* =========================
                  Error
              ========================= */}

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* =========================
                  Main Button
              ========================= */}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30"
                disabled={isLoading}
              >
                {mode === "login"
                  ? isLoading
                    ? "Logging in..."
                    : "Login"
                  : isLoading
                    ? "Creating Account..."
                    : "Create Account"}
              </Button>

              {/* ==================================================
                  LOGIN ONLY — OR + GOOGLE
              ================================================== */}

              {mode === "login" && (
                <>
                  {/* OR Divider */}

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />

                    <span className="text-xs font-medium text-muted-foreground">
                      OR
                    </span>

                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {/* Google Login */}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-black shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/90"
                  >
                    <svg
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 21.72c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.72Z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M6.54 13.8a5.86 5.86 0 0 1 0-3.6V7.67H3.3a9.75 9.75 0 0 0 0 8.66l3.24-2.53Z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 6.17c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.28 14.63 2.28 12 2.28a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.89 9.46 6.17 12 6.17Z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </>
              )}
            </div>

            {/* =========================
                Bottom Toggle
            ========================= */}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeChange("register")}
                    className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeChange("login")}
                    className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
