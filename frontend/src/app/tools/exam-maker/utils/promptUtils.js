// Build the exam generation prompt with the specific format required
export const buildExamPrompt = (formData, classrooms, fileContents, user = {}) => {
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

  // 1. Start with system instruction
  let prompt = `[SYSTEM INSTRUCTION - DO NOT INCLUDE IN RESPONSE]
You are an expert exam creator with years of experience in educational design and pedagogy.
Your task is to create a high-quality exam according to the specifications below.
IMPORTANT: Your response must contain ONLY the exam itself. DO NOT include any explanations, reasoning, or thought process about how you created the exam.

[EXAM SPECIFICATIONS]
SUBJECT: ${parsedData.subject}
EXAM NAME: ${formData.examName || 'Exam'}
NUMBER OF QUESTIONS: MUST HAVE EXACTLY ${parsedData.numQuestions} QUESTIONS
QUESTION TYPE: ${parsedData.questionType}
TOTAL POINTS: ${parsedData.totalPoints}
EDUCATION LEVEL: ${parsedData.classroom}
REGION: ${user.region || "Unknown"}`; // Use a fallback value for region

  // 2. Include scoring style if not "equal"
  if (formData.scoringStyle !== "equal") {
    prompt += `\nSCORING STYLE: Custom distribution as follows: ${parsedData.customScoringDetails}`;
  }

  // 3. Add additional instructions
  if (formData.additionalInfo) {
    prompt += `

[ADDITIONAL INSTRUCTIONS]
${formData.additionalInfo}`;
  }

  // 4. Add reference materials
  prompt += `

[REFERENCE MATERIALS]
Please use the following reference materials as guidelines for how the questions and their contents could be in your exam:
${fileContents
    ? fileContents
    : "No reference materials provided."
}`;

  // 5. Add example template
  prompt += `

[EXAMPLE TEMPLATE] (FOR REFERENCE ONLY)
Title: Sample Exam - Subject
Subtitle: 

1) [Question text here]
   A) ...
   B) ...
   C) ...
   D) ...

2) [Question text here]
   True or False: ...
`;

  // 6. Add formatting requirements
  prompt += `

[FORMATTING REQUIREMENTS]
1. The exam MUST be in English
2. The reply MUST ONLY contain the exam, no additional text or comments.
3. Include a clear title and subtitle with the exam name and subject.
4. Number all questions sequentially.
5. For multiple-choice questions, use options labeled as A), B), C), etc.
6. Clearly indicate the point value for each question.
7. Ensure proper spacing between questions.
8. Format the exam in a clean, professional manner suitable for classroom use.
9. Ensure the exam follows educational standards for ${parsedData.classroom} level in ${user.region || "Unknown"}.
10. Make sure the total points add up to exactly ${parsedData.totalPoints}.
11. Use proper formatting for each question type (e.g., multiple choice with options, true/false with clear statements).
12. Include clear section headers if mixing different types of questions.
13. DO NOT include any reasoning, planning, or thought process in your response.
14. DO NOT explain how you created the exam or what considerations you made.
15. ONLY output the final exam content, starting directly with the title.
`;

  // 7. Add checklist
  prompt += `
[CHECKLIST - DO NOT INCLUDE IN RESPONSE]
1) Did you include only the exam and nothing else?
2) Did you include exactly ${parsedData.numQuestions} questions?
3) Do the total points add up to exactly ${parsedData.totalPoints}?
4) Are there any details that are not supported by the references?
5) Did you follow all formatting requirements strictly?
6) Did you remove ALL reasoning and explanations from your response?

If any check fails, revise your answer before finalizing.
`;

  // 8. Final instruction
  prompt += `
[FINAL INSTRUCTION - DO NOT INCLUDE IN RESPONSE]
Now, produce a complete exam following all the specifications and requirements above.
If any information is missing, note it clearly rather than inventing details.
CRITICAL: Your response must begin with the exam title and contain ONLY the exam content. DO NOT include any explanations, reasoning, or thought process.
`;

  return prompt;
};