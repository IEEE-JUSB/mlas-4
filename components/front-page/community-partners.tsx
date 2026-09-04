import partners from '../../data/comm-partners.json'

export default function CommunityPartnerSection() {
  return (
    <section
      id="comm-partners"
      className="w-full bg-transparent dark:bg-transparent border-t border-zinc-200 dark:border-zinc-900 py-16"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Community Partners
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-10 max-w-md">
          Supported by leading local tech communities driving the AI ecosystem forward.
        </p>

        {/* Partners Grid */}
        <div className="flex flex-wrap items-center justify-center gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center text-center group"
            >
              <img
                src={partner.image}
                alt={partner.alt}
                className="w-28 h-28 object-cover rounded-md mb-4 shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">
                {partner.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}