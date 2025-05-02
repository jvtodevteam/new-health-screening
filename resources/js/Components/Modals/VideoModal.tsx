import React from "react";
import { X, ChevronRight } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface VideoModalProps {
  onClose: () => void;
  videoType: "map" | "guide";
}

const VideoModal: React.FC<VideoModalProps> = ({ onClose, videoType }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="font-bold text-lg">
            {videoType === "map" 
              ? t.ijenCraterExperience 
              : t.registrationGuide}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="relative h-[50vh]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={videoType === "map" 
              ? "https://www.youtube.com/embed/eq1Lu4Lr19Y" // Kawah Ijen video
              : "https://www.youtube.com/embed/t73EOoLtLFE" // Registration guide video
            }
            title={videoType === "map" ? "Kawah Ijen Experience" : "Registration Guide"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        {videoType === "guide" && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">
              {t.registrationStepsOverview}
            </h4>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1 text-sm">
              <li>{t.step1Title} - {t.step1Desc}</li>
              <li>{t.step2Title} - {t.step2Desc}</li>
              <li>{t.step3Title} - {t.step3Desc}</li>
              <li>{t.step4Title} - {t.step4Desc}</li>
            </ol>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = route('screenings.create');
                }}
                className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t.startRegistrationNow}
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoModal;