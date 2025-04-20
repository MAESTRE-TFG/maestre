export const buildExamPrompt = (formData, classrooms, fileContents, user = {}) => {

  // Find the selected classroom
  const selectedClassroom = classrooms.find(c => c.id.toString() === formData.classroom.toString());
  const academicLevel = selectedClassroom ? selectedClassroom.academic_course : "Desconocido";

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
  let prompt = `[INSTRUCCIÓN DEL SISTEMA - NO INCLUIR EN LA RESPUESTA]
Eres un creador de exámenes experto con años de experiencia en diseño educativo y pedagogía.
Tu tarea es crear un examen de alta calidad según las especificaciones a continuación.
IMPORTANTE: Tu respuesta debe contener ÚNICAMENTE el examen. NO incluyas explicaciones, razonamientos o procesos de pensamiento sobre cómo creaste el examen.

[ESPECIFICACIONES DEL EXAMEN]
ASIGNATURA: ${parsedData.subject}
NOMBRE DEL EXAMEN: ${formData.examName || "Examen"}
NÚMERO DE PREGUNTAS: DEBE TENER EXACTAMENTE ${parsedData.numQuestions} PREGUNTAS
TIPO DE PREGUNTAS: ${parsedData.questionType}
PUNTOS TOTALES: ${parsedData.totalPoints}
NIVEL EDUCATIVO: ${parsedData.classroom}
REGIÓN: ${user.region || "Desconocido"}`;

  // 2. Include scoring style if not "equal"
  if (formData.scoringStyle !== "equal") {
    prompt += `\nESTILO DE PUNTUACIÓN: Distribución personalizada como sigue: ${parsedData.customScoringDetails}`;
  }

  // 3. Add additional instructions
  if (formData.additionalInfo) {
    prompt += `\n\n[INSTRUCCIONES ADICIONALES]\n${formData.additionalInfo}`;
  }

  // 4. Add reference materials
  prompt += `\n\n[MATERIALES DE REFERENCIA]\nPor favor, utiliza los siguientes materiales de referencia como guía para cómo podrían ser las preguntas y su contenido en tu examen:\n${fileContents || "No se proporcionaron materiales de referencia."}`;

  // 5. Add example template
  prompt += `\n\n[PLANTILLA DE EJEMPLO] (SOLO PARA REFERENCIA)
Título: Examen de Ejemplo - Asignatura
Subtítulo: 

1) [Texto de la pregunta aquí]
   A) ...
   B) ...
   C) ...
   D) ...

2) [Texto de la pregunta aquí]
   Verdadero o Falso: ...`;

  // 6. Add formatting requirements
  prompt += `\n\n[REQUISITOS DE FORMATO]
NIVEL EDUCATIVO: ${parsedData.classroom}
REGIÓN: ${user.region || "Desconocido"}
PUNTOS TOTALES: ${parsedData.totalPoints}`;

  // 7. Add checklist
  prompt += `\n\n[LISTA DE VERIFICACIÓN]
NÚMERO DE PREGUNTAS: ${parsedData.numQuestions}
PUNTOS TOTALES: ${parsedData.totalPoints}`;

  // 8. Final instruction
  prompt += `\n\n[INSTRUCCIÓN FINAL]
Por favor, asegúrate de que el examen esté completo y cumpla con todas las especificaciones antes de finalizar.`;

  return prompt;
};