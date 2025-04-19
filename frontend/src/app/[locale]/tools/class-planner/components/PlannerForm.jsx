"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ClassroomSelector from "./ClassroomSelector";
import ModelSelector from "./ModelSelector";
import FileUploadSection from "./FileUploadSection";
import PlayfulnessSlider from "./PlayfulnessSlider";
import LabelInputContainer from "./LabelInputContainer";

const PlannerForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  isGenerating, 
  classrooms,
  uploadedFiles,
  handleFileUpload,
  removeUploadedFile,
  isProcessingFile,
  setShowMaterialsModal,
  userMaterials,
  theme
}) => {
  const t = useTranslations("LessonPlanner");

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
      {/* Form content - Left Column */}
      <div className="space-y-6">
        <LabelInputContainer>
          <Label htmlFor="subject" className="flex items-center text-sm font-medium mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="rgb(76,161,84)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {t("fields.subject.label")}
          </Label>
          <Input 
            id="subject" 
            name="subject" 
            placeholder={t("fields.subject.placeholder")}
            type="text" 
            required 
            value={formData.subject} 
            onChange={handleChange}
            className={`focus:ring-2 focus:ring-offset-0 ${theme === 'dark' ? 'focus:ring-indigo-500/40' : 'focus:ring-indigo-500/30'}`}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="theme" className="flex items-center text-sm font-medium mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="rgb(76,161,84)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {t("fields.theme.label")}
          </Label>
          <Input 
            id="theme" 
            name="theme" 
            placeholder={t("fields.theme.placeholder")}
            type="text" 
            required 
            value={formData.theme} 
            onChange={handleChange}
            className={`focus:ring-2 focus:ring-offset-0 ${theme === 'dark' ? 'focus:ring-indigo-500/40' : 'focus:ring-indigo-500/30'}`}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="planName" className="flex items-center text-sm font-medium mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="rgb(76,161,84)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t("fields.planName.label")}
          </Label>
          <Input 
            id="planName" 
            name="planName" 
            placeholder={t("fields.planName.placeholder")}
            type="text" 
            value={formData.planName} 
            onChange={handleChange}
            className={`focus:ring-2 focus:ring-offset-0 ${theme === 'dark' ? 'focus:ring-indigo-500/40' : 'focus:ring-indigo-500/30'}`}
          />
        </LabelInputContainer>

        <ClassroomSelector 
          classrooms={classrooms} 
          value={formData.classroom} 
          onChange={handleChange} 
          theme={theme} 
        />

        <PlayfulnessSlider
          value={formData.playfulnessLevel}
          onChange={handleChange}
          theme={theme}
        />
      </div>

      {/* Form content - Right Column */}
      <div className="space-y-6">
        <LabelInputContainer>
          <Label htmlFor="numLessons" className="flex items-center text-sm font-medium mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="purple">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {t("fields.numLessons.label")}
          </Label>
          <Input 
            id="numLessons" 
            name="numLessons" 
            type="number" 
            min="1" 
            max="10" 
            required 
            value={formData.numLessons} 
            onChange={handleChange}
            className={`focus:ring-2 focus:ring-offset-0 ${theme === 'dark' ? 'focus:ring-indigo-500/40' : 'focus:ring-indigo-500/30'}`}
          />
        </LabelInputContainer>

        <ModelSelector 
          value={formData.llmModel} 
          onChange={handleChange} 
          theme={theme} 
        />

        <FileUploadSection 
          uploadedFiles={uploadedFiles}
          handleFileUpload={handleFileUpload}
          removeUploadedFile={removeUploadedFile}
          isProcessingFile={isProcessingFile}
          setShowMaterialsModal={setShowMaterialsModal}
          theme={theme}
        />

        <LabelInputContainer>
          <Label htmlFor="additionalInfo" className="flex items-center text-sm font-medium mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="blue">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {t("fields.additionalInfo.label")}
          </Label>
          <Textarea 
            id="additionalInfo" 
            name="additionalInfo" 
            placeholder={t("fields.additionalInfo.placeholder")}
            rows={4} 
            value={formData.additionalInfo} 
            onChange={handleChange}
            className={`focus:ring-2 focus:ring-offset-0 ${theme === 'dark' ? 'focus:ring-indigo-500/40' : 'focus:ring-indigo-500/30'}`}
          />
        </LabelInputContainer>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-medium text-white transition-all",
              "flex items-center justify-center space-x-2",
              isGenerating
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span>{t("buttons.generating")}</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{t("buttons.generatePlan")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlannerForm;