'use client';

// Placeholder array - Replace with your actual contact details
const CONTACT_PERSONS = [
  {
    id: 1,
    role: 'Event Lead',
    name: 'Supratim Chakraborty',
    email: 'schakraborty.lmb20@gmail.com',
    phone: '+91 91233 78441',
  },
  {
    id: 2,
    role: 'Event Lead',
    name: 'Sarin Sanyal',
    email: 'sarinsanyal2005@gmail.com',
    phone: '+91 94322 64022',
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="w-full bg-transparent dark:bg-transparent border-t border-zinc-200 dark:border-zinc-900 py-16 sm:py-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Intro / Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-merriweather text-purple-600 dark:text-purple-300 tracking-wider text-xs sm:text-sm font-semibold uppercase">
            Get In Touch
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Contact Us
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about the event or schedule? Reach out directly to our team leads below.
          </p>
        </div>

        {/* Contact Cards (2 Columns on Desktop, Stacked on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CONTACT_PERSONS.map((person) => (
            <div
              key={person.id}
              className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5"
            >
              {/* Role Tag */}
              <span className="inline-block text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800/50 mb-4">
                {person.role}
              </span>

              {/* Name */}
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                {person.name}
              </h3>

              {/* Details List */}
              <div className="mt-6 flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${person.email}`}
                    className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                  >
                    {person.email}
                  </a>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href={`tel:${person.phone}`}
                    className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                  >
                    {person.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}