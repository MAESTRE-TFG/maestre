import { Label } from "@/components/ui/label";
import LabelInputContainer from "./LabelInputContainer";

const ScoringStyleSelector = ({ value, onChange, theme }) => {
  return (
    <LabelInputContainer>
      <Label className="text-sm font-medium mb-1.5 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="rgb(25,65,166)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Scoring Style
      </Label>
      <div className="flex space-x-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="equal"
            name="scoringStyle"
            value="equal"
            checked={value === "equal"}
            onChange={onChange}
            className="form-radio"
          />
          <label htmlFor="equal" className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Equal Points
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="custom"
            name="scoringStyle"
            value="custom"
            checked={value === "custom"}
            onChange={onChange}
            className="form-radio"
          />
          <label htmlFor="custom" className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Custom Distribution
          </label>
        </div>
      </div>
    </LabelInputContainer>
  );
};

export default ScoringStyleSelector;