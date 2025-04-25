export const promptTemplates = {
  en: {
    systemInstruction: `[SYSTEM INSTRUCTION - DO NOT INCLUDE IN RESPONSE]
You are an expert exam creator with years of experience in educational design and pedagogy.
Your task is to create a high-quality exam according to the specifications below.
IMPORTANT: Your response must contain ONLY the exam itself. DO NOT include any explanations, reasoning, or thought process about how you created the exam.`,
    examSpecifications: (parsedData, formData, user) => `[EXAM SPECIFICATIONS]
SUBJECT: ${parsedData.subject}
EXAM NAME: ${formData.examName || 'Exam'}
NUMBER OF QUESTIONS: MUST HAVE EXACTLY ${parsedData.numQuestions} QUESTIONS
QUESTION TYPE: ${parsedData.questionType}
TOTAL POINTS: ${parsedData.totalPoints}
EDUCATION LEVEL: ${parsedData.classroom}
REGION: ${user.region || "Unknown"}`,
    scoringStyle: (parsedData) => `SCORING STYLE: Custom distribution as follows: ${parsedData.customScoringDetails}`,
    additionalInstructions: (formData) => `[ADDITIONAL INSTRUCTIONS]
${formData.additionalInfo}`,
    referenceMaterials: (fileContents) => `[REFERENCE MATERIALS]
Please use the following reference materials as guidelines for how the questions and their contents could be in your exam:
${fileContents ? fileContents : "No reference materials provided."}`,
    exampleTemplate: `[EXAMPLE TEMPLATE] (FOR REFERENCE ONLY)
Title: Sample Exam - Subject
Subtitle: 

1) [Question text here]
   [Optional space here for answer].

2) [Question text here]
   [Optional space here for answer].`,
    formattingRequirements: (parsedData, user) => `[FORMATTING REQUIREMENTS]
1. The exam MUST be in English
2. The reply MUST ONLY contain the exam, no additional text or comments.
3. Include a clear title and subtitle with the exam name and subject.
4. Number all questions sequentially.
5. Clearly indicate the point value for each question.
6. Ensure proper spacing between questions.
7. Format the exam in a clean, professional manner suitable for classroom use.
8. Ensure the exam follows educational standards for ${parsedData.classroom} level in ${user.region || "Unknown"}.
9. Make sure the total points add up to exactly ${parsedData.totalPoints}.
10. Use proper formatting for each question type (e.g., multiple choice with options, true/false with clear statements).
11. Include clear section headers if mixing different types of questions.
12. DO NOT include any reasoning, planning, or thought process in your response.
13. DO NOT explain how you created the exam or what considerations you made.
14. ONLY output the final exam content, starting directly with the title.`,
    checklist: (parsedData) => `[CHECKLIST - DO NOT INCLUDE IN RESPONSE]
1) Did you include only the exam and nothing else?
2) Did you include exactly ${parsedData.numQuestions} questions?
3) Do the total points add up to exactly ${parsedData.totalPoints}?
4) Are there any details that are not supported by the references?
5) Did you follow all formatting requirements strictly?
6) Did you remove ALL reasoning and explanations from your response?

If any check fails, revise your answer before finalizing.`,
    finalInstruction: `[FINAL INSTRUCTION - DO NOT INCLUDE IN RESPONSE]
Now, produce a complete exam following all the specifications and requirements above.
If any information is missing, note it clearly rather than inventing details.
CRITICAL: Your response must begin with the exam title and contain ONLY the exam content. DO NOT include any explanations, reasoning, or thought process.`
  },

  es: {
    systemInstruction: `[INSTRUCCIÓN DEL SISTEMA - NO INCLUIR EN LA RESPUESTA]
Eres un creador de exámenes experto con años de experiencia en diseño educativo y pedagogía.
Tu tarea es crear un examen de alta calidad según las especificaciones a continuación.
IMPORTANTE: Tu respuesta debe contener SOLO el examen en sí. NO incluyas explicaciones, razonamientos o procesos de pensamiento sobre cómo creaste el examen.`,
    examSpecifications: (parsedData, formData, user) => `[ESPECIFICACIONES DEL EXAMEN]
ASIGNATURA: ${parsedData.subject}
NOMBRE DEL EXAMEN: ${formData.examName || 'Examen'}
NÚMERO DE PREGUNTAS: DEBE TENER EXACTAMENTE ${parsedData.numQuestions} PREGUNTAS
TIPO DE PREGUNTA: ${parsedData.questionType}
PUNTOS TOTALES: ${parsedData.totalPoints}
NIVEL EDUCATIVO: ${parsedData.classroom}
REGIÓN: ${user.region || "Desconocida"}`,
    scoringStyle: (parsedData) => `ESTILO DE PUNTUACIÓN: Distribución personalizada de la siguiente manera: ${parsedData.customScoringDetails}`,
    additionalInstructions: (formData) => `[INSTRUCCIONES ADICIONALES]
${formData.additionalInfo}`,
    referenceMaterials: (fileContents) => `[MATERIALES DE REFERENCIA]
Utiliza los siguientes materiales de referencia como guías para cómo podrían ser las preguntas y sus contenidos en tu examen:
${fileContents ? fileContents : "No se proporcionaron materiales de referencia."}`,
    exampleTemplate: `[PLANTILLA DE EJEMPLO] (SOLO PARA REFERENCIA)
Título: Examen de Muestra - Asignatura
Subtítulo: 

1) [Texto de la pregunta aquí]
   [Espacio opcional aquí para la respuesta].

2) [Texto de la pregunta aquí]
   [Espacio opcional aquí para la respuesta].`,
    formattingRequirements: (parsedData, user) => `[REQUISITOS DE FORMATO]
1. El examen DEBE estar completamente y únicamente en español
2. La respuesta DEBE contener ÚNICAMENTE el examen, sin texto adicional ni comentarios.
3. Incluye un título y subtítulo claros con el nombre del examen y la asignatura.
4. Numera todas las preguntas de forma secuencial.
5. Indica claramente el valor en puntos de cada pregunta.
6. Asegúrate de un espaciado adecuado entre las preguntas.
7. Formatea el examen de manera limpia y profesional, adecuado para uso en el aula.
8. Asegúrate de que el examen siga los estándares educativos para el nivel ${parsedData.classroom} en ${user.region || "Desconocida"}.
9. Asegúrate de que los puntos totales sumen exactamente ${parsedData.totalPoints}.
10. Usa un formato adecuado para cada tipo de pregunta (por ejemplo, opción múltiple con opciones, verdadero/falso con declaraciones claras).
11. Incluye encabezados claros de sección si mezclas diferentes tipos de preguntas.
12. NO incluyas razonamientos, planificación o procesos de pensamiento en tu respuesta.
13. NO expliques cómo creaste el examen ni qué consideraciones tomaste.
14. SOLO incluye el contenido final del examen, comenzando directamente con el título.`,
    checklist: (parsedData) => `[LISTA DE VERIFICACIÓN - NO INCLUIR EN LA RESPUESTA]
1) ¿Incluiste solo el examen y nada más?
2) ¿Incluiste exactamente ${parsedData.numQuestions} preguntas?
3) ¿Los puntos totales suman exactamente ${parsedData.totalPoints}?
4) ¿Hay detalles que no estén respaldados por las referencias?
5) ¿Seguiste estrictamente todos los requisitos de formato?
6) ¿Eliminaste TODOS los razonamientos y explicaciones de tu respuesta?

Si alguna verificación falla, revisa tu respuesta antes de finalizar.`,
    finalInstruction: `[INSTRUCCIÓN FINAL - NO INCLUIR EN LA RESPUESTA]
Ahora, produce un examen completo siguiendo todas las especificaciones y requisitos anteriores.
Si falta alguna información, anótala claramente en lugar de inventar detalles.
CRÍTICO: Tu respuesta debe comenzar con el título del examen y contener SOLO el contenido del examen. NO incluyas explicaciones, razonamientos o procesos de pensamiento.`
  }
}