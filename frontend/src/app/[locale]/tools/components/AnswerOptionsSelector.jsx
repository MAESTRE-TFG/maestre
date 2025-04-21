import React from "react";
import { useTranslations } from "next-intl";
import LabelInputContainer from "./LabelInputContainer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AnswerOptionsSelector = ({ value, onChange, theme }) => {

  const t = useTranslations("TestMaker.AnswerOptionsSelector");

  return (
    <LabelInputContainer>
      <Label htmlFor="subject" className="flex items-center text-sm font-medium mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="rgb(25,65,166)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t("label")}
      </Label>

      <Input
        type="number"
        min="3"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full p-2 rounded border ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-800"
        }`}
      />
      <p className="text-xs mt-1 text-gray-500">{t("helperText")}</p>
      </LabelInputContainer>
    );
};

export default AnswerOptionsSelector;