"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { SidebarDemo } from "@/components/sidebar-demo";
import { IconCopy, IconCheck, IconHistory, IconTrash } from "@tabler/icons-react";

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
  const [translationHistory, setTranslationHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Load translation history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      try {
        setTranslationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing translation history:", e);
      }
    }
  }, []);

  // Save translation history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
  }, [translationHistory]);

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
      
      // Add to translation history
      const targetLangName = languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage;
      const newHistoryItem = {
        id: Date.now(),
        sourceText: sourceText,
        translatedText: data.translated_text,
        targetLanguage: targetLanguage,
        targetLanguageName: targetLangName,
        timestamp: new Date().toISOString()
      };
      
      setTranslationHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Keep only the 10 most recent translations
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const loadFromHistory = (item) => {
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    setTargetLanguage(item.targetLanguage);
  };

  const clearHistory = () => {
    setTranslationHistory([]);
  };

  const removeHistoryItem = (id) => {
    setTranslationHistory(prev => prev.filter(item => item.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
            <div className="relative">
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
              {translatedText && (
                <button 
                  onClick={() => copyToClipboard(translatedText)}
                  className={cn(
                    "absolute top-2 right-2 p-2 rounded-full",
                    theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  )}
                  title="Copy to clipboard"
                >
                  {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                </button>
              )}
            </div>
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

        {/* Translation History Section */}
        <div className="mt-12 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <IconHistory className="mr-2" size={24} />
              Translation History
            </h2>
            {translationHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className={cn(
                  "px-3 py-1 text-sm rounded flex items-center",
                  theme === "dark" ? "bg-red-800 hover:bg-red-700" : "bg-red-100 hover:bg-red-200",
                  theme === "dark" ? "text-white" : "text-red-700"
                )}
              >
                <IconTrash size={16} className="mr-1" />
                Clear All
              </button>
            )}
          </div>
          
          {translationHistory.length === 0 ? (
            <div className={cn(
              "p-4 rounded-md border text-center",
              theme === "dark" ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"
            )}>
              <p>Your translation history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {translationHistory.map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "rounded-lg border shadow-sm overflow-hidden",
                    theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 flex justify-between items-center border-b",
                    theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                  )}>
                    <div className="font-medium flex items-center">
                      <span className={cn(
                        "inline-block w-2 h-2 rounded-full mr-2",
                        theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                      )}></span>
                      Translated to {item.targetLanguageName}
                    </div>
                    <div className="text-xs text-right">
                      <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3">
                    <div className="mb-3">
                      <div className="text-xs font-medium mb-1 uppercase tracking-wide">
                        <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Source</span>
                      </div>
                      <div className="text-sm line-clamp-2">{item.sourceText}</div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-xs font-medium mb-1 uppercase tracking-wide">
                        <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Translation</span>
                      </div>
                      <div className="text-sm line-clamp-2">{item.translatedText}</div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "px-4 py-2 flex justify-end gap-2 border-t",
                    theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                  )}>
                    <button
                      onClick={() => loadFromHistory(item)}
                      className={cn(
                        "text-xs px-3 py-1 rounded-md font-medium",
                        theme === "dark" 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      )}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => removeHistoryItem(item.id)}
                      className={cn(
                        "text-xs px-3 py-1 rounded-md",
                        theme === "dark" 
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      )}
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <SidebarDemo ContentComponent={Translator} />;
}