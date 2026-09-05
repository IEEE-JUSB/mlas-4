"use client";

import { useState } from "react";
import faqs from '../../data/faq.json'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="w-full bg-transparent dark:bg-transparent border-t border-zinc-200 dark:border-zinc-900 py-16"
    >
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
        
        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-10 max-w-md text-center">
          Everything you need to know about our community events and ecosystem.
        </p>

        {/* FAQ Accordion List */}
        <div className="w-full space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || index}
                className="border border-zinc-200 dark:border-zinc-800/80 rounded-lg overflow-hidden transition-colors bg-zinc-50/50 dark:bg-zinc-900/40"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-5 text-left transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 focus:outline-none"
                >
                  <span className="text-base font-semibold text-zinc-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-mono text-lg shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}