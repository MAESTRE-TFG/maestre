"use client";
import { FocusCards } from "@/components/ui/focus-cards";

export function AIToolsCards() {
  const cards = [
    {
      title: "Exam Maker",
      src: "/static/tools/exam_maker.webp",
      description: "Create comprehensive exams with our intuitive exam maker"
    },
    {
      title: "Test Generator",
      src: "/static/tools/test_maker.webp",
      description: "Generate tests efficiently with AI-powered assistance"
    },
    {
      title: "Class Planner",
      src: "/static/tools/planner.webp",
      description: "Plan your classes with our comprehensive planning tools"
    },
    {
      title: "Translator",
      src: "/static/tools/translator.webp",
      description: "Break language barriers in your classroom"
    }
  ];

  return <FocusCards cards={cards} />;
}