"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Github,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-black border-t border-zinc-900 pt-16 pb-10 text-slate-400 text-xs"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* About Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
              {/*logo */}
            </div>
            <span className="font-bold text-white text-sm tracking-wide">
              IEEE JUSB
            </span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            IEEE Jadavpur University Student Branch hosts workshops, hackathons,
            and research summits to bridge academics with industry innovation.
          </p>
        </div>

        {/* Quicklinks */}
        <div>
          <h4 className="text-white font-semibold mb-3 tracking-wider text-[11px] uppercase">
            Quicklinks
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/register"
                className="hover:text-white transition-colors"
              >
                Register for MLAS 4.0
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="hover:text-white transition-colors"
              >
                Participant Portal
              </Link>
            </li>
            <li>
              <a href="#about" className="hover:text-white transition-colors">
                About IEEE JUSB
              </a>
            </li>
            <li>
              <a href="#agenda" className="hover:text-white transition-colors">
                {" "}
                About MLAS 4.0
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="text-white font-semibold mb-3 tracking-wider text-[11px] uppercase">
            Contact Us
          </h4>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <a
                href="mailto:pilaniwalakhushwant@gmail.com"
                className="hover:text-white transition-colors"
              >
                pilaniwalakhushwant@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>+91 6297476257 (Chairperson)</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>Teqip 402, Jadavpur University, Kolkata</span>
            </li>
          </ul>
        </div>

        {/* Social Handles */}
        <div>
          <h4 className="text-white font-semibold mb-3 tracking-wider text-[11px] uppercase">
            Social Media
          </h4>
          <p className="text-[11px] text-slate-500 mb-3">
            Follow us for real-time workshop updates.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://ieee-jaduniv.in"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>
          &copy; 2026 IEEE Jadavpur University Student Branch. All rights
          reserved.
        </p>
        <p className="font-medium text-slate-400">Made with ❤️ by IEEE JUSB</p>
      </div>
    </footer>
  );
}
