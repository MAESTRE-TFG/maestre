"use client";;
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
    className="rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-65 md:h-[550px] w-full transition-all duration-300 ease-out">
    <Image
      src={card.src}
      alt={card.description} // Ensure alt property is provided
      fill
      className={cn(
        "object-cover absolute inset-0 transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )} />
    <div
      className={cn(
        "absolute inset-0 flex items-end py-8 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-0" : "opacity-100"
      )}>
      <div
        className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        {card.title}
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

export function FocusCards({ cards, onCardClick }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-[95vw] mx-auto px-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex-shrink-0"
          style={{
            aspectRatio: "16 / 9", // Maintain aspect ratio
            minWidth: "100%", // Full width for smaller screens
            maxWidth: "450px", // Restrict width for larger screens
          }}
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
