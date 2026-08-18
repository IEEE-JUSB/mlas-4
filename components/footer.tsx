'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Instagram, Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="w-full border-t border-stone-300 dark:border-zinc-800 pt-16 pb-10 text-zinc-600 dark:text-zinc-400 text-sm">
      <div className="w-full max-w-7xl mx-auto px-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-6 mb-12">

        {/* About Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-white text-sm tracking-wide">About IEEE JUSB</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed text-pretty">
            IEEE Jadavpur University Student Branch hosts workshops, hackathons, and research summits to bridge academics with industry innovation.
          </p>
        </div>

        {/* Quicklinks Column */}
        <div className="space-y-3">
          <h4 className="text-zinc-900 dark:text-white font-semibold tracking-wider text-sm uppercase">Quicklinks</h4>
          <ul className="grid grid-cols-2 xl:grid-cols-1 gap-2 text-sm">
            <li>
              <Link href="/register" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Register for MLAS 4.0
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Participant Portal
              </Link>
            </li>
            <li>
              <a href="#about" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                About IEEE JUSB
              </a>
            </li>
            <li>
              <a href="#agenda" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                About MLAS 4.0
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Details Column */}
        <div className="space-y-3">
          <h4 className="text-zinc-900 dark:text-white font-semibold tracking-wider text-sm uppercase">Contact Us</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <a href="mailto:pilaniwalakhushwant@gmail.com" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors truncate">
                pilaniwalakhushwant@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>+91 6297476257 (Chairperson)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <span>TEQIP 402, Jadavpur University, Kolkata</span>
            </li>
          </ul>
        </div>

        {/* Social Handles Column */}
        <div className="space-y-3">
          <h4 className="text-zinc-900 dark:text-white font-semibold tracking-wider text-sm uppercase">Social Media</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Follow us for real-time workshop updates.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://ieee-jaduniv.in"
              target="_blank"
              rel="noreferrer"
              aria-label="Website"
              className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <p>&copy; 2026 IEEE Jadavpur University Student Branch. All rights reserved.</p>
        <p className="font-medium text-zinc-600 dark:text-zinc-400">Made with ❤️ by IEEE JUSB</p>
      </div>
    </footer>
  );
}