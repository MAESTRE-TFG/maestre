export const promptTemplates = {
    en: {
        systemInstruction: (parsedData) => `[SYSTEM INSTRUCTION - DO NOT INCLUDE IN RESPONSE]
You are an expert in creating ${parsedData.subject} exams for ${parsedData.classroom} level education.
Your task: Create a high-quality exam with ${parsedData.numQuestions} calculation-based problems in ${parsedData.subject} only.

CRITICAL RULES:
1. ONLY include the exam content - no explanations or comments
2. ONLY create problems in ${parsedData.subject} - no other subjects
3. ALL problems must require calculations and application of concepts
4. NO theoretical or memorization questions`,
        examSpecifications: (parsedData, formData, user) => `[EXAM SPECIFICATIONS]
SUBJECT: ${parsedData.subject} (CRITICAL: ALL PROBLEMS MUST BE EXCLUSIVELY ON THIS SUBJECT)
EXAM NAME: ${formData.examName || 'Scientific Exam'}
NUMBER OF QUESTIONS: MUST HAVE EXACTLY ${parsedData.numQuestions} PROBLEMS/EXERCISES
DIFFICULTY LEVEL: ${parsedData.difficulty}/10
CONTEXT LEVEL: ${parsedData.context}
TOTAL POINTS: ${parsedData.totalPoints}
EDUCATION LEVEL: ${parsedData.classroom}
REGION: ${user.region || "Unknown"}`,
        scoringStyle: (parsedData) => `SCORING STYLE: Custom distribution as follows: ${parsedData.customScoringDetails}`,
        additionalInstructions: (formData) => `[ADDITIONAL INSTRUCTIONS]
${formData.additionalInfo}`,
        referenceMaterials: (fileContents) => `[REFERENCE MATERIALS]
Please use the following reference materials as guidelines for how the problems and exercises could be in your exam:
${fileContents ? fileContents : "No reference materials provided."}`,
        exampleTemplate: (parsedData) => {
            // Subject-specific examples
            const examples = {
                "Mathematics": `Title: Mathematics Exam - Calculus
            Subtitle: Differential Equations

            1) [5 points] Find the general solution to the differential equation:
               dy/dx + 2y = e^(-2x)
               [Space for solution]

            2) [8 points] Solve the following integral:
               ∫(x^2 * ln(x))dx
               [Space for solution]`,

                "Physics": `Title: Physics Exam - Mechanics
            Subtitle: Forces and Motion

            1) [5 points] A 2kg object is pushed up a frictionless inclined plane with a force of 25N. If the plane makes an angle of 30° with the horizontal, calculate the acceleration of the object.
               [Space for solution]

            2) [8 points] A pendulum of length 0.8m oscillates with a period of 1.8s. Calculate the value of gravitational acceleration at this location.
               [Space for solution]`,

                "Chemistry": `Title: Chemistry Exam - Thermodynamics
            Subtitle: Enthalpy and Entropy

            1) [5 points] Calculate the enthalpy change for the following reaction:
               2H₂(g) + O₂(g) → 2H₂O(g)
               Given: ΔH°f[H₂O(g)] = -241.8 kJ/mol
               [Space for solution]

            2) [8 points] A reaction has ΔH = -92.4 kJ/mol and ΔS = -184 J/(mol·K). Calculate the temperature at which this reaction becomes spontaneous.
               [Space for solution]`
            };

            // Default to a generic example if subject not found
            const subjectExample = examples[parsedData.subject] || 
            `Title: Sample ${parsedData.subject} Exam
            Subtitle: For ${parsedData.classroom} Level

            1) [5 points] [${parsedData.subject}-specific problem with calculations]
               [Space for solution]

            2) [8 points] [Another ${parsedData.subject}-specific problem requiring application of concepts]
               [Space for solution]`;

            return `[EXAMPLE TEMPLATE] (FOR REFERENCE ONLY)
            NOTE: The following is just an example format. Your exam should be in a similar format but with different problems appropriate for the subject and difficulty level. Do not copy these exact problems.
            
            ${subjectExample}`;
        },
        formattingRequirements: (parsedData, user) => `[FORMATTING REQUIREMENTS]
1. The exam MUST be in English
2. The reply MUST ONLY contain the exam, no additional text or comments.
3. Include a clear title and subtitle with the exam name and SUBJECT (${parsedData.subject}).
4. Number all problems sequentially.
5. Clearly indicate the point value for each problem.
6. Ensure proper spacing between problems.
7. Format the exam in a clean, professional manner suitable for classroom use.
8. Ensure the exam follows educational standards for ${parsedData.classroom} level in ${user.region || "Unknown"}.
9. Make sure the total points add up to exactly ${parsedData.totalPoints}.
10. Include all necessary information, formulas, constants, and diagrams needed to solve each problem.
11. CRITICAL: ALL problems MUST be focused EXCLUSIVELY on ${parsedData.subject}. Do NOT include problems from other subjects.
12. The difficulty level should be ${parsedData.difficulty}/10 appropriate for ${parsedData.classroom} level.
13. The context level is "${parsedData.context}" - ${parsedData.context === "none" ? "create direct exercises with minimal context" : parsedData.context === "medium" ? "create problems with moderate context" : "create extended problems with rich context and multiple pieces of information"}.
14. DO NOT include any reasoning, planning, or thought process in your response.
15. DO NOT explain how you created the exam or what considerations you made.
16. ONLY output the final exam content, starting directly with the title.`,
        
        // Add the missing checklist function
        checklist: (parsedData) => `[CHECKLIST - DO NOT INCLUDE IN RESPONSE]
1) Did you include only the exam and nothing else?
2) Did you include exactly ${parsedData.numQuestions} problems?
3) Do the total points add up to exactly ${parsedData.totalPoints}?
4) Are all problems focused exclusively on ${parsedData.subject}?
5) Are all problems calculation-based requiring application of concepts?
6) Did you follow all formatting requirements strictly?
7) Did you remove ALL reasoning and explanations from your response?

If any check fails, revise your answer before finalizing.`,

        // Add the missing finalInstruction property
        finalInstruction: `[FINAL INSTRUCTION - DO NOT INCLUDE IN RESPONSE]
Now, produce a complete scientific exam following all the specifications and requirements above.
If any information is missing, note it clearly rather than inventing details.
CRITICAL: Your response must begin with the exam title and contain ONLY the exam content. DO NOT include any explanations, reasoning, or thought process.`
    },

    es: {
        systemInstruction: (parsedData) => `[INSTRUCCIÓN DEL SISTEMA - NO INCLUIR EN LA RESPUESTA]
Eres un experto en crear exámenes de ${parsedData.subject} para el nivel educativo ${parsedData.classroom}.
Tu tarea: Crear un examen de alta calidad con ${parsedData.numQuestions} problemas basados en cálculos únicamente en ${parsedData.subject}.

REGLAS CRÍTICAS:
1. SOLO incluye el contenido del examen - sin explicaciones ni comentarios
2. SOLO crea problemas de ${parsedData.subject} - ninguna otra asignatura
3. TODOS los problemas deben requerir cálculos y aplicación de conceptos
4. NO preguntas teóricas o de memorización`,
        examSpecifications: (parsedData, formData, user) => `[ESPECIFICACIONES DEL EXAMEN]
ASIGNATURA: ${parsedData.subject} (CRÍTICO: TODOS LOS PROBLEMAS DEBEN SER EXCLUSIVAMENTE SOBRE ESTA ASIGNATURA)
NOMBRE DEL EXAMEN: ${formData.examName || 'Examen Científico'}
NÚMERO DE PREGUNTAS: DEBE TENER EXACTAMENTE ${parsedData.numQuestions} PROBLEMAS/EJERCICIOS
NIVEL DE DIFICULTAD: ${parsedData.difficulty}/10
NIVEL DE CONTEXTO: ${parsedData.context}
PUNTOS TOTALES: ${parsedData.totalPoints}
NIVEL EDUCATIVO: ${parsedData.classroom}
REGIÓN: ${user.region || "Desconocida"}`,
        scoringStyle: (parsedData) => `ESTILO DE PUNTUACIÓN: Distribución personalizada de la siguiente manera: ${parsedData.customScoringDetails}`,
        additionalInstructions: (formData) => `[INSTRUCCIONES ADICIONALES]
${formData.additionalInfo}`,
        referenceMaterials: (fileContents) => `[MATERIALES DE REFERENCIA]
Utiliza los siguientes materiales de referencia como guías para cómo podrían ser los problemas y ejercicios en tu examen:
${fileContents ? fileContents : "No se proporcionaron materiales de referencia."}`,
        exampleTemplate: (parsedData) => {
            // Subject-specific examples in Spanish
            const examples = {
                "Matemáticas": `Título: Examen de Matemáticas - Cálculo
            Subtítulo: Ecuaciones Diferenciales

            1) [5 puntos] Encuentra la solución general de la ecuación diferencial:
               dy/dx + 2y = e^(-2x)
               [Espacio para solución]

            2) [8 puntos] Resuelve la siguiente integral:
               ∫(x^2 * ln(x))dx
               [Espacio para solución]`,

                "Física": `Título: Examen de Física - Mecánica
            Subtítulo: Fuerzas y Movimiento

            1) [5 puntos] Un objeto de 2kg es empujado hacia arriba por un plano inclinado sin fricción con una fuerza de 25N. Si el plano forma un ángulo de 30° con la horizontal, calcula la aceleración del objeto.
               [Espacio para solución]

            2) [8 puntos] Un péndulo de longitud 0.8m oscila con un período de 1.8s. Calcula el valor de la aceleración gravitacional en esta ubicación.
               [Espacio para solución]`,

                "Química": `Título: Examen de Química - Termodinámica
            Subtítulo: Entalpía y Entropía

            1) [5 puntos] Calcula el cambio de entalpía para la siguiente reacción:
               2H₂(g) + O₂(g) → 2H₂O(g)
               Dado: ΔH°f[H₂O(g)] = -241.8 kJ/mol
               [Espacio para solución]

            2) [8 puntos] Una reacción tiene ΔH = -92.4 kJ/mol y ΔS = -184 J/(mol·K). Calcula la temperatura a la que esta reacción se vuelve espontánea.
               [Espacio para solución]`
            };

            // Default to a generic example if subject not found
            const subjectExample = examples[parsedData.subject] || 
            `Título: Examen de ${parsedData.subject} de Muestra
            Subtítulo: Para Nivel ${parsedData.classroom}

            1) [5 puntos] [Problema específico de ${parsedData.subject} que requiere cálculos]
               [Espacio para solución]

            2) [8 puntos] [Otro problema específico de ${parsedData.subject} que requiere aplicación de conceptos]
               [Espacio para solución]`;

            return `[PLANTILLA DE EJEMPLO] (SOLO PARA REFERENCIA)
            NOTA: Lo siguiente es solo un formato de ejemplo. Tu examen debe tener un formato similar pero con problemas diferentes apropiados para la asignatura y el nivel de dificultad. No copies exactamente estos problemas.
            
            ${subjectExample}`;
        },
        formattingRequirements: (parsedData, user) => `[REQUISITOS DE FORMATO]
1. El examen DEBE estar completamente y únicamente en español
2. La respuesta DEBE contener ÚNICAMENTE el examen, sin texto adicional ni comentarios.
3. Incluye un título y subtítulo claros con el nombre del examen y la ASIGNATURA (${parsedData.subject}).
4. Numera todos los problemas de forma secuencial.
5. Indica claramente el valor en puntos de cada problema.
6. Asegúrate de un espaciado adecuado entre los problemas.
7. Formatea el examen de manera limpia y profesional, adecuado para uso en el aula.
8. Asegúrate de que el examen siga los estándares educativos para el nivel ${parsedData.classroom} en ${user.region || "Desconocida"}.
9. Asegúrate de que los puntos totales sumen exactamente ${parsedData.totalPoints}.
10. Incluye toda la información necesaria, fórmulas, constantes y diagramas necesarios para resolver cada problema.
11. CRÍTICO: TODOS los problemas DEBEN estar enfocados EXCLUSIVAMENTE en ${parsedData.subject}. NO incluyas problemas de otras asignaturas.
12. El nivel de dificultad debe ser ${parsedData.difficulty}/10 apropiado para el nivel ${parsedData.classroom}.
13. El nivel de contexto es "${parsedData.context}" - ${parsedData.context === "none" ? "crea ejercicios directos con contexto mínimo" : parsedData.context === "medium" ? "crea problemas con contexto moderado" : "crea problemas extendidos con contexto rico y múltiples piezas de información"}.
14. NO incluyas razonamientos, planificación o procesos de pensamiento en tu respuesta.
15. NO expliques cómo creaste el examen ni qué consideraciones tomaste.
16. SOLO incluye el contenido final del examen, comenzando directamente con el título.`,

        checklist: (parsedData) => `[LISTA DE VERIFICACIÓN - NO INCLUIR EN LA RESPUESTA]
1) ¿Incluiste solo el examen y nada más?
2) ¿Incluiste exactamente ${parsedData.numQuestions} problemas?
3) ¿Los puntos totales suman exactamente ${parsedData.totalPoints}?
4) ¿Están todos los problemas enfocados exclusivamente en ${parsedData.subject}?
5) ¿Todos los problemas requieren cálculos y aplicación de conceptos?
6) ¿Seguiste estrictamente todos los requisitos de formato?
7) ¿Eliminaste TODOS los razonamientos y explicaciones de tu respuesta?

Si alguna verificación falla, revisa tu respuesta antes de finalizar.`,

                // Add the missing finalInstruction property for Spanish
                finalInstruction: `[INSTRUCCIÓN FINAL - NO INCLUIR EN LA RESPUESTA]
Ahora, produce un examen científico completo siguiendo todas las especificaciones y requisitos anteriores.
Si falta alguna información, anótala claramente en lugar de inventar detalles.
CRÍTICO: Tu respuesta debe comenzar con el título del examen y contener SOLO el contenido del examen. NO incluyas explicaciones, razonamientos o procesos de pensamiento.`
        }
};

        