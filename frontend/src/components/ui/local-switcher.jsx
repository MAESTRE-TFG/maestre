'use client';
import { usePathname } from '@/i18n/navigation';
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export default function LocalSwitcher({ locale }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  
  const handleChange = (e) => {
    const newLocale = e.target.value;
    
    // Get the current path without locale prefix
    let pathWithoutLocale = pathname;
    const locales = ['en', 'es'];
    
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}`)) {
        pathWithoutLocale = pathname.substring(`/${locale}`.length) || '/';
        break;
      }
    }
    
    // Build the new URL
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    // Use direct navigation to avoid any router state issues
    window.location.assign(newPath);
  };

  function onSelectChange(newLocale) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      setCurrentLocale(newLocale);
    });
  }

  return (
    <div className={cn(
      "px-4 py-2 rounded-full flex items-center transition-colors duration-300",
      theme === "dark"
        ? "bg-gray-800/50 hover:bg-gray-700/50"
        : "bg-white/20 hover:bg-white/30"
    )}>
      <select
        onChange={handleChange}
        value={locale}
        className="bg-transparent appearance-none pr-6 text-white focus:outline-none cursor-pointer font-medium hover:opacity-80 transition-opacity duration-200"
      >
        <option 
          value="en" 
          className="bg-gray-800 text-white py-2 hover:bg-gray-700"
        >
          English
        </option>
        <option 
          value="es" 
          className="bg-gray-800 text-white py-2 hover:bg-gray-700"
        >
          Español
        </option>
      </select>
      <svg className="h-4 w-4 ml-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}