"use client";

import speakers from '../../data/speakers.json'

export default function SpeakersSection() {
  return (
    <section
      id="speakers"
      className="w-full bg-transparent dark:bg-transparent border-t border-zinc-200 dark:border-zinc-900 py-16"
    >
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">

        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2 text-center">
          Speakers
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-10 max-w-md text-center">
          Meet the people speaking at the event.
        </p>

        {/* Speaker Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="relative border border-zinc-200 dark:border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/40 p-8 min-h-[320px] flex flex-col items-center justify-center text-center transition-all duration-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 hover:scale-105 hover:shadow-lg"
            >
              {/* LinkedIn Icon */}
              {speaker.linkedinUrl && (
                <a
                  href={speaker.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${speaker.name}'s LinkedIn profile`}
                  className="absolute top-4 right-4 text-zinc-400 dark:text-zinc-500 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}

              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-36 h-36 rounded-full object-cover mb-6"
              />

              <span className="text-base font-semibold text-zinc-900 dark:text-white">
                {speaker.name}
              </span>

              <div className="mt-1 flex flex-col">
                {speaker.designation.map((line, i) => (
                  <span
                    key={i}
                    className="text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}