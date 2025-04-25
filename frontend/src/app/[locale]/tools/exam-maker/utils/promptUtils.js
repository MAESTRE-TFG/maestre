import { promptTemplates } from './promptTemplates';

export const buildExamPrompt = (formData, classrooms, fileContents, user = {}, locale) => {
  // Find the selected classroom
  const selectedClassroom = classrooms.find(c => c.id.toString() === formData.classroom.toString());
  const academicLevel = selectedClassroom ? selectedClassroom.academic_course : "Unknown";

  // Parse data for prompt construction
  const parsedData = {
    subject: formData.subject,
    numQuestions: formData.numQuestions,
    questionType: formData.questionType.replace('_', ' '),
    classroom: academicLevel,
    totalPoints: formData.totalPoints,
    customScoringDetails: formData.customScoringDetails
  };

  // Select the appropriate language template or default to English
  const templates = promptTemplates[locale] || promptTemplates.en;

  // Build the prompt using the templates
  let prompt = `${templates.systemInstruction}
  
  ${templates.examSpecifications(parsedData, formData, user)}`;
  
  // For other sections:
  if (formData.scoringStyle !== "equal") {
    prompt += `\n${templates.scoringStyle(parsedData)}`;
  }

  // 3. Add additional instructions
  if (formData.additionalInfo) {
    prompt += `

${templates.additionalInstructions(formData)}`;
  }

  // 4. Add reference materials
  prompt += `

${templates.referenceMaterials(fileContents)}`;

  // 5. Add example template
  prompt += `

${templates.exampleTemplate}`;

  // 6. Add formatting requirements
  prompt += `

${templates.formattingRequirements(parsedData, user)}`;

  // 7. Add checklist
  prompt += `

${templates.checklist(parsedData)}`;

  // 8. Final instruction
  prompt += `

${templates.finalInstruction}`;

  console.log("Built Prompt:", prompt);
  return prompt;
};