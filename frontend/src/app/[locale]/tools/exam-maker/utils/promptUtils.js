// Build the exam generation prompt with the specific format required
export const buildExamPrompt = (formData, classrooms, fileContents, user = {}, t) => {
  // Find the selected classroom
  const selectedClassroom = classrooms.find(c => c.id.toString() === formData.classroom.toString());
  const academicLevel = selectedClassroom ? selectedClassroom.academic_course : t("ExamMaker.prompts.unknown");

  // Parse data for prompt construction
  const parsedData = {
    subject: formData.subject,
    numQuestions: formData.numQuestions,
    questionType: formData.questionType.replace('_', ' '),
    classroom: academicLevel,
    totalPoints: formData.totalPoints,
    customScoringDetails: formData.customScoringDetails
  };

  // 1. Start with system instruction
  let prompt = `${t("ExamMaker.prompts.systemInstruction")}

${t("ExamMaker.prompts.examSpecifications", {
    subject: parsedData.subject,
    examName: formData.examName || t("ExamMaker.defaultExamName"),
    numQuestions: parsedData.numQuestions,
    questionType: parsedData.questionType,
    totalPoints: parsedData.totalPoints,
    classroom: parsedData.classroom,
    region: user.region || t("ExamMaker.prompts.unknown")
  })}`;

  // 2. Include scoring style if not "equal"
  if (formData.scoringStyle !== "equal") {
    prompt += `\n${t("ExamMaker.prompts.scoringStyle", {
      customScoringDetails: parsedData.customScoringDetails
    })}`;
  }

  // 3. Add additional instructions
  if (formData.additionalInfo) {
    prompt += `\n\n${t("ExamMaker.prompts.additionalInstructions", {
      additionalInfo: formData.additionalInfo
    })}`;
  }

  // 4. Add reference materials
  prompt += `\n\n${t("ExamMaker.prompts.referenceMaterials", {
    fileContents: fileContents || t("ExamMaker.prompts.noReferenceMaterials")
  })}`;

  // 5. Add example template
  prompt += `\n\n${t("ExamMaker.prompts.exampleTemplate")}`;

  // 6. Add formatting requirements
  prompt += `\n\n${t("ExamMaker.prompts.formattingRequirements", {
    classroom: parsedData.classroom,
    region: user.region || t("ExamMaker.prompts.unknown"),
    totalPoints: parsedData.totalPoints
  })}`;

  // 7. Add checklist
  prompt += `\n\n${t("ExamMaker.prompts.checklist", {
    numQuestions: parsedData.numQuestions,
    totalPoints: parsedData.totalPoints
  })}`;

  // 8. Final instruction
  prompt += `\n\n${t("ExamMaker.prompts.finalInstruction")}`;

  return prompt;
};