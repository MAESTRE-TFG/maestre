import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const ClassroomSelector = ({ classrooms, value, onChange, theme }) => {
  const t = useTranslations("LessonPlanner");

  return (
    <div className="space-y-1.5">
      <Label htmlFor="classroom" className="flex items-center text-sm font-medium mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="rgb(76,161,84)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        {t("fields.classroom.label")}
      </Label>
      <select
        id="classroom"
        name="classroom"
        value={value}
        onChange={onChange}
        required
        className={cn(
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          theme === 'dark' ? "focus:ring-indigo-500/40" : "focus:ring-indigo-500/30"
        )}
      >
        <option value="">{t("fields.classroom.placeholder")}</option>
        {classrooms.map(classroom => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassroomSelector;