'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ThemeSwitcher } from './theme-switcher';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Agenda', href: '#agenda' },
  { label: 'Contact', href: '#contact' },
];

// Real, working signup route (Supabase-wired). Swap this if you build a
// dedicated /register page with event-specific fields later.
const REGISTER_HREF = '/auth/sign-up';

export default function Navbar({
  authSlot,
}: {
  /** Pass a server-rendered <AuthButton /> from page.tsx for real session state. */
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
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 },
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/70 backdrop-blur-md border-b border-zinc-900'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        {/* Left: logo */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
              {/*logo*/}
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-sm tracking-wide">MLAS 4.0</span>
              <span className="text-[10px] font-sans text-purple-400 tracking-widest uppercase">
                IEEE JUSB 
              </span>
            </div>
          </Link>
        </div>

        {/* Center: nav links, takes remaining space so it's truly centered */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: auth state, theme switcher, register CTA */}
        <div className="hidden md:flex items-center gap-4 shrink-0 ml-auto">
          {authSlot}
          <ThemeSwitcher />
          <Link
            href={REGISTER_HREF}
            className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            Register Now
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-zinc-900 px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center justify-between">
            {authSlot}
            <ThemeSwitcher />
          </div>
          <Link
            href={REGISTER_HREF}
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-black"
          >
            Register Now
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </nav>
  );
}