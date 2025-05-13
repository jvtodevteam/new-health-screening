import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

const LanguageSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Data bahasa dengan kode, nama, dan emoji bendera
  const languages = [
    { code: "en", name: "English", flag: "https://flagsweb.com/Flag_Emoji/United_Kingdom_%28UK%29_Flag_Emoji.png" },
    { code: "id", name: "Indonesia", flag: "https://flagsweb.com/Flag_Emoji/Indonesia_Flag_Emoji.png" },
    { code: "zh", name: "中文", flag: "https://s.w.org/images/core/emoji/14.0.0/svg/1f1e8-1f1f3.svg" }
  ];
  
  // Temukan bahasa yang dipilih
  const selectedLanguage = languages.find(lang => lang.code === value) || languages[0];
  
  // Tutup dropdown ketika diklik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between bg-gray-100 rounded-md py-2 px-3 text-gray-700 w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <img className="w-4 h-4 mr-2" src={selectedLanguage.flag}/>
        <span>{selectedLanguage.code.toUpperCase()}</span>
        </div>
        <ChevronDown size={16} className="text-gray-500 ml-2" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 pr-3 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              className="flex items-center px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                onChange(language.code);
                setIsOpen(false);
              }}
            >
              <img className="w-4 h-4 mr-2" src={language.flag}/>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;