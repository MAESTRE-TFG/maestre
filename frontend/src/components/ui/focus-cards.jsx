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
    className="rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full h-full aspect-[4/5] transition-all duration-300 ease-out"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
      {cards.map((card, index) => (
        <div
          key={index}
          className="cursor-pointer w-full md:h-96 lg:h-120"
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
  );
}