export const promptTemplates = {
  en: {
    systemInstruction: `[SYSTEM INSTRUCTION - DO NOT INCLUDE IN RESPONSE]
You are an expert lesson planner with years of experience in educational design and pedagogy.
Your task is to create a high-quality lesson plan according to the specifications below.
IMPORTANT: Your response must contain ONLY the lesson plan itself. DO NOT include any explanations, reasoning, or thought process about how you created the plan.`,
    teacherInfo: (user) => `Teacher Information:
- Teacher Name: ${user.first_name || ""} ${user.last_name || ""}
- Teacher Email: ${user.email || ""}`,
    classroomInfo: (classroomName, academicCourse, educationLevel, studentCount) => `Classroom Information:
- Classroom Name: ${classroomName}
- Academic Course: ${academicCourse}
- Education Level: ${educationLevel}
- Number of Students: ${studentCount}`,
    planDetails: (formData, playfulnessDescription) => `Plan Details:
- Subject: ${formData.subject}
- Theme: ${formData.theme}
- Number of Lessons: ${formData.numLessons}
- Playfulness Level: ${formData.playfulnessLevel}/100 (${playfulnessDescription})
${formData.additionalInfo ? `- Additional Information: ${formData.additionalInfo}` : ""}`,
    referenceMaterials: (materialContent) => materialContent
      ? `Reference Material Content:\n${materialContent}`
      : "",
    finalInstruction: `Please create a detailed lesson plan that includes objectives, required materials, activities, and assessment strategies for each lesson. The plan should be appropriate for the education level and incorporate engaging teaching methods.`
  },
  es: {
    systemInstruction: `[INSTRUCCIÓN DEL SISTEMA - NO INCLUIR EN LA RESPUESTA]
Eres un experto en planificación de clases con años de experiencia en diseño educativo y pedagogía.
Tu tarea es crear un plan de clases de alta calidad según las especificaciones a continuación.
IMPORTANTE: Tu respuesta debe contener SOLO el plan de clases. NO incluyas explicaciones, razonamientos o procesos de pensamiento sobre cómo creaste el plan.`,
    teacherInfo: (user) => `Información del Docente:
- Nombre del Docente: ${user.first_name || ""} ${user.last_name || ""}
- Email del Docente: ${user.email || ""}`,
    classroomInfo: (classroomName, academicCourse, educationLevel, studentCount) => `Información del Aula:
- Nombre del Aula: ${classroomName}
- Curso Académico: ${academicCourse}
- Nivel Educativo: ${educationLevel}
- Número de Estudiantes: ${studentCount}`,
    planDetails: (formData, playfulnessDescription) => `Detalles del Plan:
- Asignatura: ${formData.subject}
- Tema: ${formData.theme}
- Número de Clases: ${formData.numLessons}
- Nivel de Ludificación: ${formData.playfulnessLevel}/100 (${playfulnessDescription})
${formData.additionalInfo ? `- Información Adicional: ${formData.additionalInfo}` : ""}`,
    referenceMaterials: (materialContent) => materialContent
      ? `Contenido del Material de Referencia:\n${materialContent}`
      : "",
    finalInstruction: `Por favor, crea un plan de clases detallado que incluya objetivos, materiales necesarios, actividades y estrategias de evaluación para cada lección. El plan debe ser apropiado para el nivel educativo e incorporar métodos de enseñanza atractivos.`
  }
};