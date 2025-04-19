/**
 * Build a prompt for generating a lesson plan
 * @param {Object} formData - Form data for the plan
 * @param {Array} classrooms - Available classrooms
 * @param {string} materialContent - Content from uploaded materials
 * @param {Object} user - User information
 * @param {Function} t - Translation function
 * @returns {string} Generated prompt
 */
export const buildPlannerPrompt = (formData, classrooms, materialContent, user, t) => {
  // Find the selected classroom
  const selectedClassroom = classrooms.find(
    (c) => c.id.toString() === formData.classroom.toString()
  );

  // Get classroom details
  const classroomName = selectedClassroom ? selectedClassroom.name : "";
  const academicCourse = selectedClassroom ? selectedClassroom.academic_course : "";
  const educationLevel = selectedClassroom ? selectedClassroom.education_level : "";
  const studentCount = selectedClassroom ? selectedClassroom.student_count : 0;

  // Determine playfulness level description
  let playfulnessDescription = "";
  if (formData.playfulnessLevel <= 25) {
    playfulnessDescription = t("prompts.playfulness.veryStructured");
  } else if (formData.playfulnessLevel <= 50) {
    playfulnessDescription = t("prompts.playfulness.structured");
  } else if (formData.playfulnessLevel <= 75) {
    playfulnessDescription = t("prompts.playfulness.balanced");
  } else {
    playfulnessDescription = t("prompts.playfulness.veryPlayful");
  }

  // Build the prompt
  let prompt = `${t("prompts.intro")}

${t("prompts.teacherInfo")}:
- ${t("prompts.teacherName")}: ${user.first_name || ""} ${user.last_name || ""}
- ${t("prompts.teacherEmail")}: ${user.email || ""}

${t("prompts.classroomInfo")}:
- ${t("prompts.classroomName")}: ${classroomName}
- ${t("prompts.academicCourse")}: ${academicCourse}
- ${t("prompts.educationLevel")}: ${educationLevel}
- ${t("prompts.studentCount")}: ${studentCount}

${t("prompts.planDetails")}:
- ${t("prompts.subject")}: ${formData.subject}
- ${t("prompts.theme")}: ${formData.theme}
- ${t("prompts.numLessons")}: ${formData.numLessons}
- ${t("prompts.playfulnessLevel")}: ${formData.playfulnessLevel}/100 (${playfulnessDescription})

${formData.additionalInfo ? `${t("prompts.additionalInfo")}: ${formData.additionalInfo}` : ""}`;

  // Add material content if available
  if (materialContent) {
    prompt += `\n\n${t("prompts.materialContent")}:\n${materialContent}`;
  }

  // Add final instructions
  prompt += `\n\n${t("prompts.finalInstructions")}`;

  return prompt;
};