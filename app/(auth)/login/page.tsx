import Image from "next/image";
import { AuthForm } from "@/components/auth-form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TOTAL_IMAGES = 14;
const HIGHLIGHT_IMAGES = Array.from(
  { length: TOTAL_IMAGES },
  (_, i) => `/past-images/${i + 1}.jpeg`
);

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row mt-10">
      {/* Left Side - Past Highlights Carousel */}
      <div className="hidden lg:flex lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex-col items-center justify-center p-8 xl:p-12 overflow-hidden">
        <div className="w-full max-w-xl space-y-6 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Past Highlights
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Moments from MLAS 3.0
            </p>
          </div>

          {/* Carousel */}
          <Carousel 
            opts={{ loop: true }} 
            className="w-full max-w-lg relative group"
          >
            <CarouselContent>
              {HIGHLIGHT_IMAGES.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md">
                    <Image
                      src={src}
                      alt={`Past Highlight ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="-left-4 lg:-left-6 h-9 w-9 backdrop-blur-sm border-zinc-200 dark:border-zinc-800" />
            <CarouselNext className="-right-4 lg:-right-6 h-9 w-9 backdrop-blur-sm border-zinc-200 dark:border-zinc-800" />
          </Carousel>

        </div>
      </div>

      {/* Right Side - Login/Register Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10 min-h-svh">
        <div className="w-full max-w-sm">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}