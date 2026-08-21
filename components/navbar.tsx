"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ThemeSwitcher } from './theme-switcher';
import Image from 'next/image';

const NAV_LINKS = [
  { label: "Home", href: "/#" },
  { label: "About", href: "/#about" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar({
  authSlot,
}: {
  authSlot?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const pathname = usePathname();

  // Initial GSAP animation for Navbar reveal
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.1, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  // Animate Mobile Menu on Toggle
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'; // Lock background scroll
      
      if (mobileMenuRef.current) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: "power3.out" }
        );
      }

      // Stagger animate links inside menu
      if (linksRef.current.length > 0) {
        gsap.fromTo(
          linksRef.current.filter(Boolean),
          { opacity: 0.6, x: -5 },
          { opacity: 1, x: 0, duration: 0.1, stagger: 0.01, ease: "power2.out", delay: 0.1 }
        );
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md"
    >
      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo.png" width={35} height={35} alt="Logo" priority />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white tracking-tight">
              MLAS 4.0
            </span>
          </Link>
        </div>

        {/* Center: Links (Desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Auth & Theme (Desktop) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {authSlot}
          <ThemeSwitcher />
        </div>

        {/* Mobile toggle button */}
        <button
          className="md:hidden relative z-50 p-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white focus:outline-none transition-colors rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden fixed inset-x-4 top-20 z-40 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl p-6 overflow-hidden"
        >
          {/* Links Section */}
          <div className="flex flex-col gap-2 mb-6">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 px-3">
              Navigation
            </span>
            {NAV_LINKS.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  ref={(el) => { linksRef.current[idx] = el; }}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-semibold' 
                      : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-zinc-400 dark:text-zinc-500" />
                </a>
              );
            })}
          </div>

          {/* Footer Controls / Actions */}
          <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2">
              {authSlot}
            </div>
            <div className="shrink-0 p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}