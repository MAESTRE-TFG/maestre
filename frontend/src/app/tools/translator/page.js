"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { SidebarDemo } from "@/components/sidebar-demo";
import { IconCopy, IconCheck, IconHistory, IconTrash, IconLanguage, IconWorld } from "@tabler/icons-react";
import Image from "next/image";

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
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Error Alert */}
        {error && (
          <div className="fixed top-4 right-4 z-50 w-80">
            <div className={cn(
              "p-4 rounded-md shadow-lg",
              theme === "dark" ? "bg-red-900 text-red-100" : "bg-red-100 text-red-900"
            )}>
              {error}
              <button 
                onClick={() => setError("")}
                className="absolute top-2 right-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="relative w-full flex-1 flex flex-col items-center py-12">
          {/* Header Section with Logo */}
          <div className="w-full max-w-4xl flex items-center mb-8 justify-center space-x-6">
            <div className="relative">
              <IconLanguage 
                className="w-20 h-20 drop-shadow-lg text-primary"
              />
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1">
                <IconWorld className="w-8 h-8 text-cyan-500" />
              </div>
            </div>
            <div className="text-center">
              <h1 className={`text-4xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Maestre Translator
              </h1>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Translate text between multiple languages
              </p>
            </div>
          </div>
          
          <div className="w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Teacher Image Column */}
              <div className="hidden md:flex flex-col items-center justify-start">
                <div className={cn(
                  "mt-6 p-4 rounded-xl shadow-md w-full",
                  theme === "dark" ? "bg-gray-800/80 border border-gray-700" : "bg-white/80 border border-gray-100"
                )}>
                  <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    AI-Powered Translation
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Translate text between multiple languages with our advanced AI technology. Perfect for teachers who need to communicate with students and parents in different languages.
                  </p>
                </div>
                
                {/* Teacher image with floating animation */}
                <div className="relative w-full h-[700px] -mt-16 flex items-center justify-center">
                  <div className="animate-float relative w-96 h-full">
                    <Image
                      src="/static/teachers/5.webp"
                      alt="Teacher" 
                      layout="fill"
                      objectFit="contain"
                      className="drop-shadow-xl"
                    />
                  </div>
                </div>
              </div>
              
              {/* Translation Column */}
              <div className="col-span-1 md:col-span-2">
                <div className={cn(
                  "p-6 rounded-xl shadow-lg",
                  "bg-opacity-30 backdrop-filter backdrop-blur-lg",
                  theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
                )}>
                  <div className="space-y-6">
                    {/* Source Text */}
                    <div>
                      <label htmlFor="source-text" className={`block font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Source Text
                      </label>
                      <textarea
                        id="source-text"
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        placeholder="Enter text to translate (max 5000 characters)"
                        className={cn(
                          "w-full min-h-[180px] p-4 rounded-lg border focus:ring-2 focus:ring-primary",
                          theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        )}
                        maxLength={5000}
                      />
                      <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {sourceText.length}/5000 characters
                      </div>
                    </div>

                    {/* Target Language Selection */}
                    <div>
                      <label htmlFor="target-language" className={`block font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Target Language
                      </label>
                      <select
                        id="target-language"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className={cn(
                          "w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary",
                          theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        )}
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Translate Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleTranslate}
                        disabled={isTranslating || !sourceText.trim()}
                        className={cn(
                          "px-8 py-3 rounded-full font-medium text-white transition-all",
                          "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
                          "shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
                          "flex items-center gap-2",
                          (isTranslating || !sourceText.trim()) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isTranslating ? (
                          <>
                            <div className="h-5 w-5 rounded-full border-t-2 border-b-2 border-white animate-spin"></div>
                            Translating...
                          </>
                        ) : (
                          <>
                            <IconWorld size={20} />
                            Translate
                          </>
                        )}
                      </button>
                    </div>

                    {/* Translation Result */}
                    <div>
                      <label htmlFor="translated-text" className={`block font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Translation
                      </label>
                      <div className="relative">
                        <textarea
                          id="translated-text"
                          value={translatedText}
                          readOnly
                          placeholder="Translation will appear here"
                          className={cn(
                            "w-full min-h-[180px] p-4 rounded-lg border",
                            theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                          )}
                        />
                        {translatedText && (
                          <button 
                            onClick={() => copyToClipboard(translatedText)}
                            className={cn(
                              "absolute top-3 right-3 p-2 rounded-full",
                              theme === "dark" ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"
                            )}
                            title="Copy to clipboard"
                          >
                            {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Translation History Section */}
                <div className={cn(
                  "mt-8 p-6 rounded-xl shadow-lg",
                  "bg-opacity-30 backdrop-filter backdrop-blur-lg",
                  theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
                )}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-semibold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      <IconHistory className="mr-2" size={24} />
                      Translation History
                    </h2>
                    {translationHistory.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className={cn(
                          "px-3 py-1 text-sm rounded-full flex items-center",
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
                            theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                          )}
                        >
                          <div className={cn(
                            "px-4 py-3 flex justify-between items-center border-b",
                            theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
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
                            theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                          )}>
                            <button
                              onClick={() => loadFromHistory(item)}
                              className={cn(
                                "text-xs px-3 py-1 rounded-full font-medium",
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
                                "text-xs px-3 py-1 rounded-full",
                                theme === "dark" 
                                  ? "bg-gray-600 hover:bg-gray-500 text-gray-300" 
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Add the floating animation keyframes
const styles = `
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
`;

export default function Page() {
  return (
    <>
      <style jsx global>{styles}</style>
      <SidebarDemo ContentComponent={Translator} />
    </>
  );
}