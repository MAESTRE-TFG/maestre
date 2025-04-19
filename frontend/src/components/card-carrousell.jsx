"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useTranslations } from 'next-intl';

export function CardCarrousell() {
  const t = useTranslations('HomePage');
  
  const data = [
    {
      category: t('tool_category_assessment'),
      title: t('tool_title_exams'),
      src: "/static/tools/exam_maker.webp",
      page: "exam-maker",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      content: <CardContent>
        {t('tool_content_exams')}
        <ul className="list-disc ml-6 mt-4">
          <li>{t('tool_feature_exams_1')}</li>
          <li>{t('tool_feature_exams_2')}</li>
          <li>{t('tool_feature_exams_3')}</li>
          <li>{t('tool_feature_exams_4')}</li>
        </ul>
      </CardContent>
    },
    {
      category: t('tool_category_assessment'),
      title: t('tool_title_tests'),
      src: "/static/tools/test_maker.webp",
      page: "test-maker",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      content: <CardContent>
        {t('tool_content_tests')}
        <ul className="list-disc ml-6 mt-4">
          <li>{t('tool_feature_tests_1')}</li>
          <li>{t('tool_feature_tests_2')}</li>
          <li>{t('tool_feature_tests_3')}</li>
          <li>{t('tool_feature_tests_4')}</li>
        </ul>
      </CardContent>
    },
    {
      category: t('tool_category_organization'),
      title: t('tool_title_planner'),
      src: "/static/tools/planner.webp",
      page: "class-planner",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      content: <CardContent>
        {t('tool_content_planner')}
        <ul className="list-disc ml-6 mt-4">
          <li>{t('tool_feature_planner_1')}</li>
          <li>{t('tool_feature_planner_2')}</li>
          <li>{t('tool_feature_planner_3')}</li>
          <li>{t('tool_feature_planner_4')}</li>
        </ul>
      </CardContent>
    },
    {
      category: t('tool_category_language'),
      title: t('tool_title_translator'),
      src: "/static/tools/translator.webp",
      page: "translator",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      content: <CardContent>
        {t('tool_content_translator')}
        <ul className="list-disc ml-6 mt-4">
          <li>{t('tool_feature_translator_1')}</li>
          <li>{t('tool_feature_translator_2')}</li>
          <li>{t('tool_feature_translator_3')}</li>
          <li>{t('tool_feature_translator_4')}</li>
        </ul>
      </CardContent>
    }
  ];

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
