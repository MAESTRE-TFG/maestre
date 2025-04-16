import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/theme-provider";
import { IconX } from "@tabler/icons-react";

export const Modal = ({ isOpen, onClose, children, className }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`bg-white dark:bg-neutral-900 rounded-lg shadow-lg ${className}`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
            {children?.props?.title || "Modal"} {/* Add fallback title */}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};
