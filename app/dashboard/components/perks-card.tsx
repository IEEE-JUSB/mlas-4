import Image from "next/image"; // Remove or change to <img> if not using Next.js

type PerksCardProps = {
    tshirtImageSrc?: string;
};

export function PerksCard({ tshirtImageSrc }: PerksCardProps) {
    return (
        <div className="relative my-4 overflow-hidden rounded-lg border border-zinc-200 bg-transparent/5 shadow-sm dark:border-zinc-800">
            {/* Accent Line Matching Registration & Payment Cards */}
            <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500" />

            <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    {/* Content Area */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                                INCLUDED WITH YOUR SEAT
                            </p>
                            <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                What You Get
                            </h2>
                        </div>

                        <ul className="grid gap-3 sm:grid-cols-1 text-sm">
                            <li className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-500">
                                    ✓
                                </span>
                                <span className="font-medium">
                                    Official MLAS 4.0 Commemorative T-Shirt
                                </span>
                            </li>

                            <li className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-500">
                                    ✓
                                </span>
                                <span className="font-medium">
                                    2 Days of Immersive ML & AI Hands-on Masterclasses
                                </span>
                            </li>

                            <li className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-500">
                                    ✓
                                </span>
                                <span className="font-medium">
                                    Complimentary Meals & Refreshments for Both Days
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* T-Shirt Preview Container */}
                    <div className="relative flex h-106 w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-100/50 p-3 dark:border-zinc-800/60 dark:bg-zinc-900/40 md:w-64 md:shrink-0">
                        {tshirtImageSrc ? (
                            <img
                                src={tshirtImageSrc}
                                alt="MLAS 4.0 T-Shirt"
                                className="h-full w-full rounded-lg object-contain"
                            />
                        ) : (
                            <div className="text-center text-xs text-zinc-400">
                                [ T-Shirt Preview ]
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}