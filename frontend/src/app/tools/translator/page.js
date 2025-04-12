"use client";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { SidebarDemo } from "@/components/sidebar-demo";

const languages = [
  { code: "es", name: "Spanish" },
  { code: "ca", name: "Catalan" },
  { code: "gl", name: "Galician" },
  { code: "eu", name: "Basque" },
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "el", name: "Greek" },
  { code: "la", name: "Latin" }
];


const Translator = () => {
  const { theme } = useTheme();
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate");
      return;
    }
    if (sourceText.length > 5000) {
      setError("Text exceeds 5000 character limit");
      return;
    }

    setIsTranslating(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:8000/api/materials/translate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          text: sourceText,
          dest: targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className={cn("min-h-screen p-8 w-full", theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900")}>
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Maestre Translator
        </h1>

        {error && (
          <div className={cn(
            "mb-6 p-4 rounded-md",
            theme === "dark" ? "bg-red-900 text-red-100" : "bg-red-100 text-red-900"
          )}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 mt-5">
            <label htmlFor="source-text" className="block font-medium">Source Text</label>
            <textarea
              id="source-text"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate (max 5000 characters)"
              className={cn(
                "w-full min-h-[200px] p-3 rounded border",
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
              )}
              maxLength={5000}
            />
            <div className="text-sm text-gray-500">
              {sourceText.length}/5000 characters
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="translated-text" className="block font-medium">Translation</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className={cn(
                  "w-[180px] p-2 rounded border",
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
                )}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              id="translated-text"
              value={translatedText}
              readOnly
              placeholder="Translation will appear here"
              className={cn(
                "w-full min-h-[200px] p-3 rounded border",
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
              )}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
            className={cn(
              "px-8 py-4 text-lg rounded font-medium",
              theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600",
              "text-white disabled:opacity-50"
            )}
          >
            {isTranslating ? "Translating..." : "Translate"}
          </button>
        </div>

        {/* Document upload section - TODO: Implement */}
        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">
            Document Translation (Coming Soon)
          </h2>
          <div className={cn(
            "p-4 rounded-md border-2 border-dashed text-center",
            theme === "dark" ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"
          )}>
            <p>Upload documents for direct translation (DOCX, PDF, TXT)</p>
            <button
              className={cn(
                "mt-4 px-4 py-2 rounded border",
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300",
                "disabled:opacity-50"
              )}
              disabled
            >
              Select File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <SidebarDemo ContentComponent={Translator} />;
}