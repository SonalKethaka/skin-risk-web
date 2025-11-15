"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";

const FINISH_PATH = "/SignUp";

type Slide = {
  id: number;
  text: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: 1,
    text: "Early Detection Saves Lives",
    image: "/backgrounds/bg-01.jpg",
  },
  {
    id: 2,
    text: "Powered by Advanced AI Diagnosis.",
    image: "/backgrounds/bg-02.jpg",
  },
  {
    id: 3,
    text: "Science You Can Rely On.",
    image: "/backgrounds/bg-03.jpg",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const isLastSlide = currentSlide === slides.length - 1;

  const handleSkip = () => {
    router.push(FINISH_PATH);
  };

  const handleNext = () => {
    if (isLastSlide) {
      router.push(FINISH_PATH);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const activeSlide = slides[currentSlide];

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          key={activeSlide.id} // force re-render on slide change
          src={activeSlide.image}
          alt={activeSlide.text}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Blur + dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      </div>

      {/* Center text */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <p className="max-w-4xl text-5xl font-semibold text-white md:text-5xl">
          “{activeSlide.text}”
        </p>
      </div>

      {/* Bottom controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 px-4">
        <div className="pointer-events-auto mx-auto px-0 sm:px-4 flex w-full items-end justify-between gap-4">
          {/* Left: Skip */}
          <Button
            radius="sm"
            variant="solid"
            className="bg-[var(--color-primary)] text-white px-4 py-2 text-sm md:px-8 md:py-3 md:text-base min-w-[110px]"
            onPress={handleSkip}
          >
            Skip
          </Button>

          {/* Right: dots centered above Next */}
          <div className="flex flex-col items-center gap-2">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "h-3.5 w-3.5 rounded-full border transition-all cursor-pointer",
                    index === currentSlide
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] scale-100"
                      : "bg-white/40 border-white/80 scale-75 opacity-70"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            <Button
              radius="sm"
              variant="solid"
              className="bg-[var(--color-primary)] text-white px-4 py-2 text-sm md:px-8 md:py-3 md:text-base min-w-[110px]"
              onPress={handleNext}
            >
              {isLastSlide ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}