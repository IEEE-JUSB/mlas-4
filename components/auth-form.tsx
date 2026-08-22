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
  Mail,
  User,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AuthMode = "login" | "register";

export function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [mode, setMode] = useState<AuthMode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  // Password Validation Logic
  const passwordChecks = {
    length: /.{8,}/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  let strengthLabel = "Weak";
  if (passwordStrength >= 5) strengthLabel = "Strong";
  else if (passwordStrength >= 4) strengthLabel = "Medium";

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
      ? "bg-emerald-500"
      : passwordStrength >= 4
        ? "bg-amber-500"
        : "bg-rose-500";

  const passwordsMatch = repeatPassword.length > 0 && password === repeatPassword;
  const passwordsDoNotMatch = repeatPassword.length > 0 && password !== repeatPassword;

  const Requirement = ({
    fulfilled,
    children,
  }: {
    fulfilled: boolean;
    children: React.ReactNode;
  }) => (
    <span
      className={cn(
        "flex items-center gap-1 text-[11px] transition-colors",
        fulfilled
          ? "text-emerald-600 dark:text-emerald-400 font-medium"
          : "text-zinc-400 dark:text-zinc-500"
      )}
    >
      {fulfilled ? (
        <Check className="h-3 w-3 text-emerald-500 shrink-0" />
      ) : (
        <X className="h-3 w-3 text-zinc-300 dark:text-zinc-600 shrink-0" />
      )}
      {children}
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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      // Session cookies are automatically set by the /api/login response
      router.push('/dashboard');
      router.refresh(); // Refreshes Next.js router cache so components detect the active session
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const supabase = createClient();

  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const { error } = await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });

  //     if (error) {
  //       throw error;
  //     }

  //     router.push("/protected");
  //   } catch (error: unknown) {
  //     setError(error instanceof Error ? error.message : "An error occurred");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // =========================
  // Google Login
  // =========================

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/register-oauth`,
      },
    });

    if (error) setError(error.message);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    if (passwordStrength < 5) {
      setError("Please fulfill all password requirements before creating your account.");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handles status 400 or 500 errors from your route handler
        throw new Error(data.error || 'Failed to register account.');
      }

      // Success response from API route -> redirect to confirmation page
      router.push('/sign-up-success');
    } catch (error: unknown) {
      if (error) throw error;
      
      toast("Check your email", {
        description: "We've sent a confirmation link to " + email + ". Please check your inbox.",
        action: {
          label: "Close",
          onClick: () => console.log("Toast closed"),
        },
      });

      // Optional: Clear the form or switch them back to "login" mode
      setMode("login");
      setPassword("");
      setRepeatPassword("");

      // You can remove this router push if you want them to stay on the page
      router.push("/auth/sign-up-success"); 
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSignUp = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const supabase = createClient();

  //   setIsLoading(true);
  //   setError(null);

  //   // =========================
  //   // Password Strength
  //   // =========================

  //   if (passwordStrength < 5) {
  //     setError(
  //       "Please fulfill all password requirements before creating your account.",
  //     );

  //     setIsLoading(false);
  //     return;
  //   }

  //   // =========================
  //   // Password Match
  //   // =========================

  //   if (password !== repeatPassword) {
  //     setError("Passwords do not match.");

  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const { error } = await supabase.auth.signUp({
  //       email,
  //       password,

  //       options: {
  //         emailRedirectTo: `${window.location.origin}/protected`,

  //         data: {
  //           name: name,
  //         },
  //       },
  //     });

  //     if (error) {
  //       throw error;
  //     }

  //     router.push("/auth/sign-up-success");
  //   } catch (error: unknown) {
  //     setError(
  //       error instanceof Error
  //         ? error.message
  //         : "Something went wrong. Please try again.",
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
    <div className={cn("mx-auto w-full", className)} {...props}>
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-transparent/5 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-md">
        <CardHeader className="space-y-4 pb-4">
          {/* Segmented Mode Switcher */}
          <div className="grid w-full grid-cols-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={cn(
                "rounded-md py-1.5 font-medium transition-all",
                mode === "login"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("register")}
              className={cn(
                "rounded-md py-1.5 font-medium transition-all",
                mode === "register"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              Register
            </button>
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              {mode === "login"
                ? "Enter your email below to sign in to your account"
                : "Enter your details below to create your account"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Register Only) */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 pl-9 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 placeholder:text-zinc-400 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 pl-9 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 placeholder:text-zinc-400 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Password
                </Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => router.push("/auth/forgot-password")}
                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="h-9 pl-9 pr-9 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator (Register Only) */}
              {mode === "register" && password.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500 dark:text-zinc-400">Strength</span>
                    <span
                      className={cn(
                        "font-medium",
                        passwordStrength >= 5
                          ? "text-emerald-600 dark:text-emerald-400"
                          : passwordStrength >= 4
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {strengthLabel}
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={cn("h-full transition-all duration-300", strengthColor)}
                      style={{ width: strengthWidth }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                    <Requirement fulfilled={passwordChecks.length}>8+ characters</Requirement>
                    <Requirement fulfilled={passwordChecks.uppercase}>Uppercase</Requirement>
                    <Requirement fulfilled={passwordChecks.lowercase}>Lowercase</Requirement>
                    <Requirement fulfilled={passwordChecks.number}>Number</Requirement>
                    <Requirement fulfilled={passwordChecks.special}>Special char</Requirement>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Register Only) */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="repeat-password" className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Confirm Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className={cn(
                      "h-9 pl-9 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300",
                      passwordsMatch && "border-emerald-500/50 focus-visible:ring-emerald-500",
                      passwordsDoNotMatch && "border-rose-500 focus-visible:ring-rose-500"
                    )}
                  />
                </div>
                {passwordsDoNotMatch && (
                  <p className="text-[11px] text-rose-500">Passwords do not match</p>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900/50 p-2.5 text-xs text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-9 w-full text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              disabled={isLoading}
            >
              {mode === "login"
                ? isLoading
                  ? "Signing in..."
                  : "Sign In"
                : isLoading
                  ? "Creating account..."
                  : "Create Account"}
            </Button>

            {/* Google Login (Both Modes) */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-transparent dark:bg-zinc-900 px-2 text-zinc-400 dark:text-zinc-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="h-9 w-full text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 hover:text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}