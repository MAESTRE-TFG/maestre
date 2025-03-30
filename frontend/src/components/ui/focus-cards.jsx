"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const Card = React.memo(({
  card,
  index,
  hovered,
  setHovered
}) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className="rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full aspect-[4/5] transition-all duration-300 ease-out"
  >
    <Image
      src={card.src}
      alt={card.description || "Card image"}
      fill
      className={cn(
        "object-cover absolute inset-0 transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    />
    <div
      className={cn(
        "absolute inset-0 flex items-end py-8 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-0" : "opacity-100"
      )}
    >
      <div
        className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200"
      >
        {card.title}
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

export function FocusCards({ cards, onCardClick }) {
  const [hovered, setHovered] = useState(null);
  
  return (
    <div className="max-w-[1600px] mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-full md:min-w-[350px] lg:min-w-[550px] cursor-pointer"
            onClick={() => onCardClick(card.url)}
          >
            <Card
              card={card}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
            />
          </div>
        ))}
      </div>
    </div>
  );
}