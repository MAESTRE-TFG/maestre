"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function CardCarrousell() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full">
      <div className="relative max-w-[90vw] mx-auto">
        <Carousel items={cards} opts={{ slidesToScroll: 2 }} />
      </div>
    </div>
  );
}

const CardContent = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className={cn(
      "p-8 md:p-14 rounded-3xl mb-4 transition-transform duration-300 hover:scale-105",
      theme === "dark" ? "bg-neutral-800" : "bg-[#F5F5F7]"
    )}>
      <div className={cn(
        "text-base md:text-2xl",
        theme === "dark" ? "text-neutral-400" : "text-neutral-600"
      )}>
        {children}
      </div>
    </div>
  );
};

const data = [
  {
    category: "Assessment",
    title: "Create Engaging Exams",
    src: "/static/tools/exam_maker.webp",
    page: "exam-maker",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    content: <CardContent>
      Create comprehensive exams with our intuitive exam maker. Features include:
      <ul className="list-disc ml-6 mt-4">
        <li>Multiple question types</li>
        <li>Automatic grading</li>
        <li>Custom scoring rules</li>
        <li>Question bank management</li>
      </ul>
    </CardContent>
  },
  {
    category: "Assessment",
    title: "Generate Tests Efficiently",
    src: "/static/tools/test_maker.webp",
    page: "test-maker",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    content: <CardContent>
      Streamline your test creation process with AI-powered assistance:
      <ul className="list-disc ml-6 mt-4">
        <li>AI-generated questions</li>
        <li>Smart difficulty adjustment</li>
        <li>Topic-based generation</li>
        <li>Instant test assembly</li>
      </ul>
    </CardContent>
  },
  {
    category: "Organization",
    title: "Plan Your Classes",
    src: "/static/tools/planner.webp",
    page: "class-planner",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    content: <CardContent>
      Stay organized with our comprehensive planning tools:
      <ul className="list-disc ml-6 mt-4">
        <li>Visual class schedules</li>
        <li>Curriculum mapping</li>
        <li>Resource allocation</li>
        <li>Progress tracking</li>
      </ul>
    </CardContent>
  },
  {
    category: "Language",
    title: "Translate Materials",
    src: "/static/tools/translator.webp",
    page: "translator",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    content: <CardContent>
      Break language barriers in your classroom:
      <ul className="list-disc ml-6 mt-4">
        <li>Real-time translation</li>
        <li>Multi-language support</li>
        <li>Educational context awareness</li>
        <li>Document translation</li>
      </ul>
    </CardContent>
  }
];
