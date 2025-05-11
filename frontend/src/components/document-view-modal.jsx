import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import axios from "axios";

const DocumentViewModal = ({ showModal, setShowModal, document }) => {
  const { theme } = useTheme();
  const t = useTranslations("TermsPage");
  const [markdownContent, setMarkdownContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (document?.content) {
        try {
          setIsLoading(true);
          const response = await axios.get(document.content);
          setMarkdownContent(response.data);
        } catch (error) {
          console.error('Error fetching markdown content:', error);
          setMarkdownContent(t("alerts.failedToLoadContent"));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchContent();
  }, [document?.content]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className={cn(
          "w-full max-w-4xl rounded-xl shadow-lg overflow-hidden flex flex-col",
          theme === "dark" ? "bg-gray-800" : "bg-white",
          "h-[80vh]"
        )}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            {document?.title || "Document View"} - {document?.version}
          </h3>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => { 
                if (!document?.pdf_content) { 
                  alert(t("alerts.noPdf")); 
                  return; 
                } 
                const newTab = window.open(document.pdf_content, "_blank"); 
                if (!newTab) { 
                  alert(t("alerts.failedToOpenPdf")); 
                } 
              }} 
              className="btn btn-secondary btn-sm flex items-center gap-2"
            > 
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
              > 
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                /> 
              </svg> 
              {t("buttons.openDocument")} 
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="px-8 md:px-12">
              <article className={cn(
                "prose max-w-none",
                theme === "dark" ? "prose-invert text-gray-200" : "",
                "prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
                "prose-p:text-base prose-p:leading-7",
                "prose-a:text-blue-600 dark:prose-a:text-blue-400",
                "prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1",
                "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg",
                "prose-img:rounded-lg prose-img:shadow-md",
                "prose-ul:list-disc prose-ol:list-decimal",
                "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic",
                "prose-table:border-collapse prose-table:w-full",
                "prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:p-3 prose-th:bg-gray-100 dark:prose-th:bg-gray-800",
                "prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-3",
                "dark:prose-strong:text-white dark:prose-em:text-gray-200"
              )}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="mb-4 text-3xl font-bold" {...props} />,
                    h2: ({node, ...props}) => <h2 className="mb-3 text-2xl font-bold" {...props} />,
                    h3: ({node, ...props}) => <h3 className="mb-2 text-xl font-bold" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="mb-4 list-disc pl-5" {...props} />,
                    ol: ({node, ...props}) => <ol className="mb-4 list-decimal pl-5" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? 
                        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1" {...props} /> :
                        <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto" {...props} />,
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-8">
                        <table {...props} />
                      </div>
                    ),
                    th: ({node, ...props}) => (
                      <th className="text-left font-bold bg-gray-100 dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-700" {...props} />
                    ),
                    td: ({node, ...props}) => (
                      <td className="p-3 border border-gray-300 dark:border-gray-700" {...props} />
                    )
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </article>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewModal;