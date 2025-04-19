import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es', 'gl', 'ca', 'eu'],
 
  // Used when no locale matches
  defaultLocale: 'es'
});