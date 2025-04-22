/**
 * Utilities for converting text with mathematical formulas to LaTeX format
 */

// Regular expressions for detecting common mathematical notations
const MATH_PATTERNS = {
  // Fractions: a/b
  fractions: /(\d+)\/(\d+)/g,
  
  // Powers: x^2, x^n
  powers: /(\w+)\^(\w+|\{\w+\})/g,
  
  // Square roots: sqrt(x)
  squareRoots: /sqrt\(([^)]+)\)/g,
  
  // Greek letters: alpha, beta, etc.
  greekLetters: /\b(alpha|beta|gamma|delta|epsilon|theta|lambda|pi|sigma|omega)\b/g,
  
  // Integrals: ∫f(x)dx
  integrals: /∫([^d]+)d([a-z])/g,
  
  // Derivatives: d/dx
  derivatives: /d\/d([a-z])/g,
  
  // Limits: lim x→∞
  limits: /lim\s+([a-z])→([\w∞]+)/g,
  
  // Summations: ∑
  summations: /∑([^=]+)=(\d+)→(\w+)/g
};

/**
 * Converts plain text mathematical notation to LaTeX
 * @param {string} text - Text containing mathematical notation
 * @returns {string} - Text with mathematical notation converted to LaTeX
 */
export const convertToLatex = (text) => {
  // Replace each pattern with its LaTeX equivalent
  let latexText = text;
  
  // Convert fractions: a/b → \frac{a}{b}
  latexText = latexText.replace(MATH_PATTERNS.fractions, '\\frac{$1}{$2}');
  
  // Convert powers: x^2 → x^{2}
  latexText = latexText.replace(MATH_PATTERNS.powers, '$1^{$2}');
  
  // Convert square roots: sqrt(x) → \sqrt{x}
  latexText = latexText.replace(MATH_PATTERNS.squareRoots, '\\sqrt{$1}');
  
  // Convert Greek letters: alpha → \alpha
  latexText = latexText.replace(MATH_PATTERNS.greekLetters, '\\$1');
  
  // Convert integrals: ∫f(x)dx → \int f(x) \, dx
  latexText = latexText.replace(MATH_PATTERNS.integrals, '\\int $1 \\, d$2');
  
  // Convert derivatives: d/dx → \frac{d}{dx}
  latexText = latexText.replace(MATH_PATTERNS.derivatives, '\\frac{d}{d$1}');
  
  // Convert limits: lim x→∞ → \lim_{x \to \infty}
  latexText = latexText.replace(MATH_PATTERNS.limits, '\\lim_{$1 \\to $2}');
  
  // Convert summations: ∑i=1→n → \sum_{i=1}^{n}
  latexText = latexText.replace(MATH_PATTERNS.summations, '\\sum_{$1=$2}^{$3}');
  
  return latexText;
};

/**
 * Wraps inline math expressions with LaTeX delimiters
 * @param {string} text - Text containing math expressions
 * @returns {string} - Text with math expressions wrapped in LaTeX delimiters
 */
export const wrapInlineMath = (text) => {
  // Find potential inline math expressions and wrap them with $...$ delimiters
  // This is a simplified approach - a more sophisticated detection would be needed for production
  
  // Example: Replace expressions like "x = 5" with "$x = 5$"
  return text.replace(/(\w+\s*[=<>]\s*[\w\d]+)/g, '$$$1$$');
};

/**
 * Wraps block math expressions with LaTeX delimiters
 * @param {string} text - Text containing block math expressions
 * @returns {string} - Text with block math expressions wrapped in LaTeX delimiters
 */
export const wrapBlockMath = (text) => {
  // Find potential block math expressions and wrap them with $$...$$ delimiters
  // This is a simplified approach - a more sophisticated detection would be needed for production
  
  // Example: Replace expressions that are on their own line
  const lines = text.split('\n');
  const processedLines = lines.map(line => {
    // If line contains only a math expression, wrap it in block math delimiters
    if (line.trim().match(/^[\w\d\s=+\-*/^(){}[\]]+$/)) {
      return `$$${line.trim()}$$`;
    }
    return line;
  });
  
  return processedLines.join('\n');
};

/**
 * Processes a complete exam text to convert all mathematical notations to LaTeX
 * @param {string} examText - The complete exam text
 * @returns {string} - Exam text with mathematical notations converted to LaTeX
 */
export const processExamText = (examText) => {
  // Split the exam into sections (questions, etc.)
  const sections = examText.split(/(\d+\)\s+\[\d+\s+points\])/g);
  
  // Process each section
  const processedSections = sections.map(section => {
    // If this is a question header, don't process it
    if (section.match(/^\d+\)\s+\[\d+\s+points\]$/)) {
      return section;
    }
    
    // Convert mathematical notations to LaTeX
    let processedSection = convertToLatex(section);
    
    // Wrap inline and block math expressions
    processedSection = wrapInlineMath(processedSection);
    processedSection = wrapBlockMath(processedSection);
    
    return processedSection;
  });
  
  return processedSections.join('');
};

/**
 * Detects and processes diagrams in the exam text
 * @param {string} examText - The complete exam text
 * @returns {string} - Exam text with diagrams converted to LaTeX TikZ code
 */
export const processDiagrams = (examText) => {
  // This is a placeholder for diagram processing
  // In a real implementation, you would need to:
  // 1. Detect diagram descriptions in the text
  // 2. Convert them to TikZ code or another LaTeX-compatible format
  
  // For now, we'll just return the original text
  return examText;
};