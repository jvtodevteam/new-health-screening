import React from "react";
import { X, Plus } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

export interface Participant {
  title: string;
  name: string;
  birth_year: string;
  nationality: string;
  id_number: string;
  has_medical_history: boolean;
  allergies?: string;
  past_medical_history?: string;
  current_medications?: string;
  family_medical_history?: string;
}

interface ParticipantFormProps {
  participant: Participant;
  index: number;
  errors: Record<string, string>;
  showRemoveButton?: boolean;
  onChange: (index: number, field: keyof Participant, value: any) => void;
  onRemove: (index: number) => void;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({
  participant,
  index,
  errors,
  showRemoveButton = true,
  onChange,
  onRemove
}) => {
  const { t } = useTranslation();
  
  // Helper to get field error
  const getFieldError = (field: string): string | undefined => {
    return errors[`participants.${index}.${field}`];
  };
  
  return (
    <div className="bg-white border shadow-sm rounded-xl shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800">
          {t.participantInfo} {index + 1}
        </h2>
        {showRemoveButton && (
          <button
            className="text-red-500"
            onClick={() => onRemove(index)}
            type="button"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.title}
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3"
              value={participant.title || "Mr"}
              onChange={(e) => onChange(index, "title", e.target.value)}
            >
              <option>Mr</option>
              <option>Mrs</option>
              <option>Ms</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.name}
            </label>
            <input
              type="text"
              value={participant.name || ""}
              onChange={(e) => onChange(index, "name", e.target.value)}
              className={`w-full border ${
                getFieldError("name")
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg p-3`}
            />
            {getFieldError("name") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("name")}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.birthYear}
            </label>
            <input
              type="number"
              value={participant.birth_year || ""}
              onChange={(e) => onChange(index, "birth_year", e.target.value)}
              className={`w-full border ${
                getFieldError("birth_year")
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg p-3`}
              placeholder={t.birthYearPlaceholder}
              min="1900"
              max={new Date().getFullYear()}
            />
            {getFieldError("birth_year") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("birth_year")}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.nationality}
            </label>
            <select
              className={`w-full border ${
                getFieldError("nationality")
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg p-3`}
              value={participant.nationality || ""}
              onChange={(e) => onChange(index, "nationality", e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Singapore">Singapore</option>
              <option value="Australia">Australia</option>
              <option value="United States">United States</option>
              <option value="Other">Other</option>
            </select>
            {getFieldError("nationality") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("nationality")}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {participant.nationality === "Indonesia"
                ? "KTP Number"
                : "Passport Number"}
            </label>
            <input
              type="text"
              value={participant.id_number || ""}
              onChange={(e) => onChange(index, "id_number", e.target.value)}
              className={`w-full border ${
                getFieldError("id_number")
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg p-3`}
              placeholder={
                participant.nationality === "Indonesia"
                  ? "16 digits"
                  : "8-9 characters"
              }
            />
            {getFieldError("id_number") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("id_number")}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {participant.nationality === "Indonesia"
                ? t.ktpValidation
                : t.passportValidation}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-700">
            {t.medicalHistory}
          </span>
          <div
            className={`w-12 h-6 rounded-full ${
              participant.has_medical_history
                ? "bg-green-500"
                : "bg-gray-300"
            } flex items-center p-1 transition-all duration-200 cursor-pointer`}
            onClick={() => onChange(index, "has_medical_history", !participant.has_medical_history)}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-all duration-200 ${
                participant.has_medical_history
                  ? "translate-x-6"
                  : ""
              }`}
            ></div>
          </div>
        </div>

        {participant.has_medical_history && (
          <div className="space-y-4 p-3 bg-green-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.allergies}
              </label>
              <input
                type="text"
                value={participant.allergies || ""}
                onChange={(e) => onChange(index, "allergies", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="List any allergies"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.pastMedical}
              </label>
              <textarea
                value={participant.past_medical_history || ""}
                onChange={(e) => onChange(index, "past_medical_history", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                rows={2}
                placeholder="Describe any past medical conditions"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.currentMeds}
              </label>
              <input
                type="text"
                value={participant.current_medications || ""}
                onChange={(e) => onChange(index, "current_medications", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="List current medications"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.familyMedical}
              </label>
              <textarea
                value={participant.family_medical_history || ""}
                onChange={(e) => onChange(index, "family_medical_history", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                rows={2}
                placeholder="Any relevant family medical history"
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantForm;