import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const Modal = ({ isOpen, onClose, children }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={cn(
          "w-full max-w-md p-6 relative rounded-lg shadow-lg",
          theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
            {children.props.title}
          </h2>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export { Modal };
