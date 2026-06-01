"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const fallbackImages = [
  "/rwanda/placeholder-1.jpg",
  "/rwanda/placeholder-2.jpg",
  "/rwanda/placeholder-3.jpg",
  "/rwanda/placeholder-4.jpg",
  "/rwanda/placeholder-5.jpg",
];

interface RwandaBackgroundProps {
  images?: string[];
}

export function RwandaBackground({ images }: RwandaBackgroundProps) {
  const bgImages = images && images.length > 0 ? images : fallbackImages;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (bgImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  return (
    <div className="fixed inset-0 z-0">
      {bgImages.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === currentIndex ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Rwanda landscape ${idx + 1}`}
            fill
            className="object-cover"
            priority={idx === 0}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {bgImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-gold w-6" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
