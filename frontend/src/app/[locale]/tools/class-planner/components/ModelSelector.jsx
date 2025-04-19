import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const ModelSelector = ({ value, onChange, theme }) => {
  const t = useTranslations("LessonPlanner");

  const models = [
    { id: "llama3.2:3b", name: "Llama 3.2 (3B)" },
    { id: "llama3.2:8b", name: "Llama 3.2 (8B)" },
    { id: "llama3.2:70b", name: "Llama 3.2 (70B)" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "gpt-4", name: "GPT-4" }
  ];

  return (
    <div className="space-y-1.5">
      <Label htmlFor="llmModel" className="flex items-center text-sm font-medium mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="purple">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {t("fields.llmModel.label")}
      </Label>
      <select
        id="llmModel"
        name="llmModel"
        value={value}
        onChange={onChange}
        className={cn(
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          theme === 'dark' ? "focus:ring-indigo-500/40" : "focus:ring-indigo-500/30"
        )}
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;