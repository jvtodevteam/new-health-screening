import { usePage } from "@inertiajs/react";

// Import file bahasa
import en from "../lang/en.json";
import id from "../lang/id.json";
import zh from "../lang/zh.json";

const languages = { en, id, zh };

export const useTranslation = () => {
  const { locale } = usePage().props;
  return {
    t: languages[locale] || languages.en,
    locale,
    setLanguage: (lang) => window.location.href = route('settings.update-language', lang)
  };
};