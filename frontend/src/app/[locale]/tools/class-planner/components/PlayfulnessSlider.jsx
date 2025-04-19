import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const PlayfulnessSlider = ({ value, onChange, theme }) => {
  const t = useTranslations("LessonPlanner");

  const getPlayfulnessLabel = (value) => {
    if (value <= 20) return t("fields.playfulnessLevel.veryStructured");
    if (value <= 40) return t("fields.playfulnessLevel.structured");
    if (value <= 60) return t("fields.playfulnessLevel.balanced");
    if (value <= 80) return t("fields.playfulnessLevel.playful");
    return t("fields.playfulnessLevel.veryPlayful");
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor="playfulnessLevel" className="flex items-center text-sm font-medium mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="rgb(76,161,84)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t("fields.playfulnessLevel.label")}: {getPlayfulnessLabel(value)} ({value}%)
      </Label>
      <input
        id="playfulnessLevel"
        name="playfulnessLevel"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={onChange}
        className={cn(
          "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
          "dark:bg-gray-700",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full",
          theme === 'dark' 
            ? "[&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:hover:bg-indigo-600" 
            : "[&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:hover:bg-indigo-700"
        )}
      />
      <div className="flex justify-between text-xs mt-1">
        <span>{t("fields.playfulnessLevel.veryStructured")}</span>
        <span>{t("fields.playfulnessLevel.veryPlayful")}</span>
      </div>
    </div>
  );
};

export default PlayfulnessSlider;