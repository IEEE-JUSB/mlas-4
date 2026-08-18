"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ThemeSwitcher } from './theme-switcher';
import Image from 'next/image';

const NAV_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar({
  authSlot,
}: {
  authSlot?: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 },
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Added 'relative' and 'justify-between' */}
      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" width={35} height={35} alt="Logo"/>
          </Link>
        </div>

        {/* Center: Links (Absolutely centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-black dark:text-slate-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Auth & Theme */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {authSlot}
          <ThemeSwitcher />
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-900 dark:text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900 px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-zinc-600 dark:text-slate-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center justify-between">
            {authSlot}
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}