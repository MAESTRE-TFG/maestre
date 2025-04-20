import { useTranslations } from "next-intl";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { IconUserCircle } from "@tabler/icons-react";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { IconSchool } from "@tabler/icons-react";

const NoClassroomModal = ({ 
  isOpen, 
  onClose, 
  params,
}) => {
  const router = useRouter();
  const t = useTranslations("ToolsPage.noClassroomModal");
  const { theme } = useTheme();
  const locale = params?.locale || 'es';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div title="  ">
        <div className={cn("p-6", theme === "dark" ? "bg-purple-600" : "bg-purple-500")}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <IconUserCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
              {t('no_classroom_modal_title')}
            </h2>
          </div>
        </div>
        <div className="p-6">
          <p className={cn("mb-6 text-base", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
            {t('no_classroom_modal_description')}
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => router.push(`/${locale}/tools`)} // Wrap in a function
              className={cn(
                "btn btn-md btn-secondary",
                theme === "dark" ? "text-white hover:bg-neutral-700" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {t('back_to_tools')}
            </button>
            <button
              onClick={() => router.push(`/${locale}/classrooms`)} // Wrap in a function
              className={cn(
                "btn btn-md btn-purple",
                "flex items-center gap-2",
                theme === "dark" ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
              )}
            >
              <IconSchool className="h-5 w-5" />
              {t('go_to_classrooms')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NoClassroomModal;