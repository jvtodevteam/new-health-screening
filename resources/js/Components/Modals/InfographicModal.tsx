import React from "react";
import { X, ChevronRight } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface InfographicModalProps {
  onClose: () => void;
}

const InfographicModal: React.FC<InfographicModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="font-bold text-lg">
            {t.registrationProcessFlow}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <img 
            src="/assets/img/infografik2.png" 
            alt="Registration Process Flow"
            className="w-full h-auto rounded-lg" 
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-4">
              {t.infographicDescription}
            </p>
            <button
              onClick={() => {
                onClose();
                window.location.href = route('screenings.create');
              }}
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              {t.startRegistration}
              <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfographicModal;