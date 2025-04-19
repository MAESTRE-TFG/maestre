/**
 * Build a prompt for generating a lesson plan
 * @param {Object} formData - Form data for the plan
 * @param {Array} classrooms - Available classrooms
 * @param {string} materialContent - Content from uploaded materials
 * @param {Object} user - User information
 * @returns {string} Generated prompt
 */
export const buildPlannerPrompt = (formData, classrooms, materialContent, user) => {
  // Remove the translation function
  // const t = useTranslations("LessonPlanner");

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
    playfulnessDescription = "Enfoque muy estructurado con actividades formales";
  } else if (formData.playfulnessLevel <= 50) {
    playfulnessDescription = "Enfoque estructurado con algunos elementos interactivos";
  } else if (formData.playfulnessLevel <= 75) {
    playfulnessDescription = "Mezcla equilibrada de actividades estructuradas e interactivas";
  } else {
    playfulnessDescription = "Enfoque muy lúdico con actividades altamente interactivas";
  }

  // Build the prompt
  let prompt = `Crea un plan de clases detallado basado en la siguiente información:

Información del Docente:
- Nombre del Docente: ${user.first_name || ""} ${user.last_name || ""}
- Email del Docente: ${user.email || ""}

Información del Aula:
- Nombre del Aula: ${classroomName}
- Curso Académico: ${academicCourse}
- Nivel Educativo: ${educationLevel}
- Número de Estudiantes: ${studentCount}

Detalles del Plan:
- Asignatura: ${formData.subject}
- Tema: ${formData.theme}
- Número de clases: ${formData.numLessons}
- Nivel de Ludificación: ${formData.playfulnessLevel}/100 (${playfulnessDescription})

${formData.additionalInfo ? `Información Adicional: ${formData.additionalInfo}` : ""}`;

  // Add material content if available
  if (materialContent) {
    prompt += `\n\nContenido del Material de Referencia:\n${materialContent}`;
  }

  // Add final instructions
  prompt += `\n\nPor favor, crea un plan de clases detallado que incluya objetivos, materiales necesarios, actividades y estrategias de evaluación para cada lección. El plan debe ser apropiado para el nivel educativo e incorporar métodos de enseñanza atractivos.`;

  return prompt;
};