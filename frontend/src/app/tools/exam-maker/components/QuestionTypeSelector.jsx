import { Label } from "@/components/ui/label";
import LabelInputContainer from "./LabelInputContainer";

const QuestionTypeSelector = ({ value, onChange, theme }) => {
  const questionTypes = [
    // { value: "multiple_choice", label: "Multiple Choice" },
    // { value: "true_false", label: "True/False" },
    { value: "short_answer", label: "Short Answer" },
    { value: "essay", label: "Essay (Max 1 page)" },
    { value: "long_essay", label: "Long Essay (More than 1 page)" },
    { value: "fill_blank", label: "Fill in the Blank" },
    { value: "matching", label: "Matching" },
    { value: "ordering", label: "Ordering" },
    {value: "text analysis", label: "Text Analysis"},
    {value: "image_analysis", label: "Image Analysis and Comparrison"},
    { value: "mixed", label: "Mixed (Various Types)" }
  ];

  return (
    <LabelInputContainer>
      <Label htmlFor="questionType" className="flex items-center text-sm font-medium mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="orange">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Question Type
      </Label>
      <div className="relative">
        <select
          id="questionType"
          name="questionType"
          required
          value={value}
          onChange={onChange}
          className="appearance-none"
        >
          {questionTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
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

export default QuestionTypeSelector;