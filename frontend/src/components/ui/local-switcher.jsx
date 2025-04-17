'use client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export default function LocalSwitcher({ currentLocale }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  
  const onSelectChange = e => {
    const nextLocale = e.target.value;
    
    // Get the path without the locale prefix
    // The pathname will be something like /es/some/path or /en/some/path
    let pathWithoutLocale = pathname;
    
    // Strip the locale prefix from the pathname
    const locales = ['en', 'es'];
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}`)) {
        pathWithoutLocale = pathname.substring(`/${locale}`.length) || '/';
        break;
      }
    }
    
    // If pathWithoutLocale is just '/', we don't want to add an extra slash
    const newPath = `/${nextLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    router.replace(newPath);
  };
  
  return (
    <div className={cn(
      "px-4 py-2 rounded-full flex items-center transition-colors duration-300",
      theme === "dark"
        ? "bg-gray-800/50 hover:bg-gray-700/50"
        : "bg-white/20 hover:bg-white/30"
    )}>
      <select
        onChange={onSelectChange}
        value={currentLocale}
        className="bg-transparent appearance-none pr-6 text-white"
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
      <svg className="h-4 w-4 ml-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}