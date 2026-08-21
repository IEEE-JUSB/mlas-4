import type { Metadata } from "next";
import { Geist, Merriweather } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SiteBackground from "@/components/site-background";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Machine Learning Accelerator Summit 4.0",
  description:
    "Sign in with Google to register for the workshop, access event passes, and manage your participant profile.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${merriweather.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Fixed, page-wide animated backdrop — sits at z-0 behind every
              section. Everything else below is stacked above it at z-10+
              so the animation shows through wherever a section doesn't
              paint its own opaque background. */}
          <SiteBackground />

          <div className="relative z-10">
            <Navbar
              authSlot={
                !hasEnvVars ? (
                  <EnvVarWarning />
                ) : (
                  <Suspense>
                    <AuthButton />
                  </Suspense>
                )
              }
            />
            {children}
            <Toaster />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
