import { usePage } from "@inertiajs/react";
import React, { createContext, useContext, useState } from "react";

// Import language files (you'll need to create these)
import en from "../lang/en.json";
import id from "../lang/id.json";
import zh from "../lang/zh.json";

const languages = {
  en,
  id,
  zh
};

export const useTranslation = () => {
  const { locale } = usePage().props;
  const t = languages[locale] || languages.en;
  
  const setLanguage = async (language) => {
    // This would make an API call to update the user's language preference
    // For now, we'll just redirect to refresh the page with the new language
    window.location.href = route('settings.update-language', {
      language
    });
  };
  
  return { t, locale, setLanguage };
};