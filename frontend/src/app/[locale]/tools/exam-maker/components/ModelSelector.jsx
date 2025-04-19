import { Label } from "@/components/ui/label";
import LabelInputContainer from "./LabelInputContainer";
import { useTranslations } from "next-intl";

const ModelSelector = ({ value, onChange, theme }) => {
  const t = useTranslations("ExamMaker");

  const llmModels = [
    { value: "llama3.2:3b", label: t("fields.llmModel.options.llama") }, 
    { value: "deepseek-r1:7b", label: t("fields.llmModel.options.deepseek") } 
  ];

  return (
    <LabelInputContainer>
      <Label htmlFor="llmModel" className="flex items-center text-sm font-medium mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {t("fields.llmModel.label")} 
      </Label>
      <div className="relative">
        <select
          id="llmModel"
          name="llmModel"
          required
          value={value}
          onChange={onChange}
          className="appearance-none"
        >
          {llmModels.map(model => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </LabelInputContainer>
  );
};

export default ModelSelector;