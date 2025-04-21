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
    customScoringDetails: formData.customScoringDetails,
    numAnswerOptions: formData.numAnswerOptions, // Include the new parameter
  };

  // Select the appropriate language template or default to English
  const templates = promptTemplates[locale] || promptTemplates.en;

  // Build the prompt using the templates
  let prompt = `${templates.systemInstruction}
  
  ${templates.examSpecifications(parsedData, formData, user)}`;
  
  // Add number of answer options to the prompt
  prompt += `\nEach question should have ${parsedData.numAnswerOptions} answer options.`;

  // Add answer options details
  prompt += `\n${templates.answerOptions(parsedData)}`;

  // For other sections:
  if (formData.scoringStyle !== "equal") {
    prompt += `\n${templates.scoringStyle(parsedData)}`;
  }

  // Add additional instructions
  if (formData.additionalInfo) {
    prompt += `

${templates.additionalInstructions}`;
  }

  // Add reference materials
  prompt += `

${templates.referenceMaterials}`;

  // Add example template
  prompt += `

${templates.exampleTemplate}`;

  // Add formatting requirements
  prompt += `

${templates.formattingRequirements}`;

  // Add checklist
  prompt += `

${templates.checklist}`;

  // Final instruction
  prompt += `

${templates.finalInstruction}`;

  return prompt;
};