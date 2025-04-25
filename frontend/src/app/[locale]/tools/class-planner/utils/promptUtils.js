import { promptTemplates } from './promptTemplates';

/**
 * Build a prompt for generating a lesson plan
 * @param {Object} formData - Form data for the plan
 * @param {Array} classrooms - Available classrooms
 * @param {string} materialContent - Content from uploaded materials
 * @param {Object} user - User information
 * @param {string} locale - Locale for the prompt language
 * @returns {string} Generated prompt
 */
export const buildPlannerPrompt = (formData, classrooms, materialContent, user, locale = "en") => {
  // Find the selected classroom
  const selectedClassroom = classrooms.find(
    (c) => c.id.toString() === formData.classroom.toString()
  );

  // Get classroom details
  const classroomName = selectedClassroom ? selectedClassroom.name : "Unknown";
  const academicCourse = selectedClassroom ? selectedClassroom.academic_course : "Unknown";
  const educationLevel = selectedClassroom ? selectedClassroom.education_level : "Unknown";
  const studentCount = selectedClassroom ? selectedClassroom.student_count : 0;

  // Determine playfulness level description
  let playfulnessDescription = "";
  if (formData.playfulnessLevel <= 25) {
    playfulnessDescription = locale === "es"
      ? "Enfoque muy estructurado con actividades formales"
      : "Highly structured approach with formal activities";
  } else if (formData.playfulnessLevel <= 50) {
    playfulnessDescription = locale === "es"
      ? "Enfoque estructurado con algunos elementos interactivos"
      : "Structured approach with some interactive elements";
  } else if (formData.playfulnessLevel <= 75) {
    playfulnessDescription = locale === "es"
      ? "Mezcla equilibrada de actividades estructuradas e interactivas"
      : "Balanced mix of structured and interactive activities";
  } else {
    playfulnessDescription = locale === "es"
      ? "Enfoque muy lúdico con actividades altamente interactivas"
      : "Highly playful approach with highly interactive activities";
  }

  // Select the appropriate language template
  const templates = promptTemplates[locale] || promptTemplates.en;

  // Build the prompt using templates
  let prompt = `${templates.systemInstruction}

${templates.teacherInfo(user)}

${templates.classroomInfo(classroomName, academicCourse, educationLevel, studentCount)}

${templates.planDetails(formData, playfulnessDescription)}`;

  // Add material content if available
  if (materialContent) {
    prompt += `\n\n${templates.referenceMaterials(materialContent)}`;
  }

  // Add final instructions
  prompt += `\n\n${templates.finalInstruction}`;

  return prompt;
};