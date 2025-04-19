"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTransition, useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  const localeNames = {
    en: "English",
    es: "Español",
    ca: "Català",
    gl: "Galego",
    eu: "Euskara",
  };

  function onSelectChange(newLocale) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      setCurrentLocale(newLocale);
    });
  }

  return (
    <div className="relative">
      <Select
        value={currentLocale}
        onValueChange={onSelectChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={localeNames[currentLocale]} />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(localeNames).map((localeKey) => (
            <SelectItem key={localeKey} value={localeKey}>
              {localeNames[localeKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}