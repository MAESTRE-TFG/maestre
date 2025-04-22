import { promptTemplates } from './promptTemplates';

export const buildExamPrompt = (formData, classrooms, fileContents, user = {}, locale) => {
  // Find the selected classroom
  const selectedClassroom = classrooms.find(c => c.id.toString() === formData.classroom.toString());
  const academicLevel = selectedClassroom ? selectedClassroom.academic_course : "Unknown";

  // Parse data for prompt construction
  const parsedData = {
    subject: formData.subject,
    numQuestions: formData.numQuestions,
    difficulty: formData.difficulty,
    context: formData.context,
    classroom: academicLevel,
    totalPoints: formData.totalPoints,
    customScoringDetails: formData.customScoringDetails
  };

  // Select the appropriate language template or default to English
  const templates = promptTemplates[locale] || promptTemplates.en;

  // Build the prompt using the templates
  let prompt = `${templates.systemInstruction(parsedData)}
  
  ${templates.examSpecifications(parsedData, formData, user)}`;
  
  // For other sections:
  if (formData.scoringStyle !== "equal") {
    prompt += `\n${templates.scoringStyle(parsedData)}`;
  }

  // Add additional instructions
  if (formData.additionalInfo) {
    prompt += `

${templates.additionalInstructions(formData)}`;
  }

  // Add reference materials
  prompt += `

${templates.referenceMaterials(fileContents)}`;

  // Add example template
  prompt += `

${templates.exampleTemplate(parsedData)}`;

  // Add formatting requirements
  prompt += `

${templates.formattingRequirements(parsedData, user)}`;

  // Add checklist
  prompt += `

${templates.checklist(parsedData)}`;

  // Final instruction
  prompt += `

${templates.finalInstruction}`;

  console.log(prompt);
  return prompt;
};