import React from "react";
import { useTranslation } from "../../hooks/useTranslation";

interface LoadingScreenProps {
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fullScreen = true }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`flex flex-col items-center justify-center bg-black ${fullScreen ? 'fixed inset-0 z-50' : 'p-8 rounded-xl'}`}>
      <div className="mb-8 text-center">
        <img src="/assets/img/logo-blue.png" className="mx-auto w-64" alt="Logo" />
        <h1 className="text-3xl font-bold text-white">
          {t.appName}
        </h1>
        <p className="opacity-80 mt-2 text-white">{t.appTagline}</p>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <div
          className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;