import { Label } from "@/components/ui/label";
import LabelInputContainer from "./LabelInputContainer";

const ClassroomSelector = ({ classrooms, value, onChange, theme }) => {
  return (
    <LabelInputContainer>
      <Label htmlFor="classroom" className="flex items-center text-sm font-medium mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="rgb(76,161,84)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Classroom (Difficulty Level)
      </Label>
      <div className="relative">
        <select
          id="classroom"
          name="classroom"
          required
          value={value}
          onChange={onChange}
          className="appearance-none"
        >
          <option value="" disabled>Select a classroom</option>
          {classrooms.map(classroom => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name} - {classroom.academic_course}
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

export default ClassroomSelector;