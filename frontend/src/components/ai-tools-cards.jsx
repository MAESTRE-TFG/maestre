"use client";
import { FocusCards } from "@/components/ui/focus-cards";
import { useRouter } from "next/navigation";

export function AIToolsCards() {
  const router = useRouter();
  const cards = [
    {
      // title: "Exam Maker",
      src: "/static/tools/exam_maker.webp",
      description: "Create comprehensive exams with our intuitive exam maker",
      url: "/tools/exam-maker"
    },
    {
      // title: "Test Generator",
      src: "/static/tools/test_maker.webp",
      description: "Generate tests efficiently with AI-powered assistance",
      url: "/tools/test-generator"
    },
    {
      // title: "Class Planner",
      src: "/static/tools/planner.webp",
      description: "Plan your classes with our comprehensive planning tools",
      url: "/tools/class-planner"
    },
    {
      // title: "Translator",
      src: "/static/tools/translator.webp",
      description: "Break language barriers in your classroom",
      url: "/tools/translator"
    }
  ];

  const handleCardClick = (url) => {
    router.push(url);
  };

  return <FocusCards cards={cards} onCardClick={handleCardClick} />;
}