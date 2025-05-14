import React, { useState } from "react";
import { ArrowLeft, X, Plus } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import SearchableSelect from "../../Components/UI/SearchableSelect";

const ParticipantInfo = ({ data, setData,nationalities, errors, onNext, onBack }) => {
    const { t } = useTranslation();
    const [validationErrors, setValidationErrors] = useState({});
    
    // Validate ID numbers
    const validateIdNumber = (nationalityId, idNumber, index) => {
        const errors = { ...validationErrors };

        if (!idNumber) {
            errors[`idNumber_${index}`] = "ID number is required";
        } else if (
            nationalityId == 101 &&
            !/^\d{16}$/.test(idNumber)
        ) {
            errors[`idNumber_${index}`] = "KTP must be 16 digits";
        } else if (
            nationalityId != 101 &&
            !/^[A-Z0-9]{8,9}$/.test(idNumber)
        ) {
            errors[`idNumber_${index}`] = "Passport must be 8-9 characters";
        } else {
            delete errors[`idNumber_${index}`];
        }

        setValidationErrors(errors);
    };

    // Validate name (no numbers)
    const validateName = (name, index) => {
        const errors = { ...validationErrors };

        if (!name) {
            errors[`name_${index}`] = "Name is required";
        } else if (/\d/.test(name)) {
            errors[`name_${index}`] = "Name cannot contain numbers";
        } else {
            delete errors[`name_${index}`];
        }

        setValidationErrors(errors);
    };

    // Validate birth year
    const validateBirthYear = (birthYear, index) => {
        const errors = { ...validationErrors };
        const currentYear = new Date().getFullYear();

        if (!birthYear) {
            errors[`birthYear_${index}`] = "Birth year is required";
        } else if (isNaN(birthYear)) {
            errors[`birthYear_${index}`] = "Birth year must be a number";
        } else if (
            parseInt(birthYear) < 1900 ||
            parseInt(birthYear) > currentYear
        ) {
            errors[
                `birthYear_${index}`
            ] = `Birth year must be between 1900 and ${currentYear}`;
        } else {
            delete errors[`birthYear_${index}`];
        }

        setValidationErrors(errors);
    };
    
    // Handle input change
    const handleInputChange = (index, field, value) => {
        const updatedParticipants = [...data.participants];
        updatedParticipants[index] = {
            ...updatedParticipants[index],
            [field]: value,
        };
        setData('participants', updatedParticipants);

        // Validate based on field type
        if (field == "id_number") {
            validateIdNumber(
                updatedParticipants[index].nationality_id,
                value,
                index
            );
        }

        if (field == "nationality_id") {
            validateIdNumber(
                value,
                updatedParticipants[index].id_number,
                index
            );
        }

        if (field == "name") {
            validateName(value, index);
        }

        if (field == "birth_year") {
            validateBirthYear(value, index);
        }
    };
    
    // Add participant
    const handleAddParticipant = () => {
        if (data.participants.length < 10) {
            const updatedParticipants = [...data.participants];
            updatedParticipants.push({
                title: "Mr",
                name: "",
                birth_year: "",
                nationality_id: "",
                id_number: "",
                has_medical_history: false,
                allergies: "",
                past_medical_history: "",
                current_medications: "",
                family_medical_history: "",
            });
            setData('participants', updatedParticipants);
        }
    };
    
    // Remove participant
    const handleRemoveParticipant = (index) => {
        if (data.participants.length > 1) {
            const updatedParticipants = data.participants.filter((_, i) => i !== index);
            setData('participants', updatedParticipants);
            
            // Clear validation errors
            const updatedErrors = { ...validationErrors };
            Object.keys(updatedErrors).forEach((key) => {
                if (key.endsWith(`_${index}`)) {
                    delete updatedErrors[key];
                }
            });
            setValidationErrors(updatedErrors);
        }
    };
    
// Check if form can proceed
const canProceed = () => {
    // Check if all required fields are filled
    return data.participants.every(
        (p) => p.name && p.birth_year && p.nationality_id && p.id_number
    ) && Object.keys(validationErrors).length == 0;
};

return (
    <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white p-4 flex items-center shadow-sm">
            <button onClick={onBack} className="mr-2">
                <ArrowLeft size={24} className="text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
                {t.participantInfo}
            </h1>
        </div>

        <div className="p-6">
            {data.participants.map((participant, index) => (
                <div
                    key={index}
                    className="bg-white border shadow-sm rounded-xl shadow-sm p-4 mb-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-gray-800">
                            {t.participantInfo} {index + 1}
                        </h2>
                        {index > 0 && (
                            <button
                                className="text-red-500"
                                onClick={() => handleRemoveParticipant(index)}
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
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "title",
                                            e.target.value
                                        )
                                    }
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
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full border ${
                                        validationErrors[`name_${index}`] || errors[`participants.${index}.name`]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg p-3`}
                                />
                                {(validationErrors[`name_${index}`] || errors[`participants.${index}.name`]) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {validationErrors[`name_${index}`] || errors[`participants.${index}.name`]}
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
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "birth_year",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full border ${
                                        validationErrors[`birthYear_${index}`] || errors[`participants.${index}.birth_year`]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg p-3`}
                                    placeholder={t.birthYearPlaceholder}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                                {(validationErrors[`birthYear_${index}`] || errors[`participants.${index}.birth_year`]) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {validationErrors[`birthYear_${index}`] || errors[`participants.${index}.birth_year`]}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.nationality} 
                                </label>
                                <SearchableSelect
                                    options={nationalities}
                                    selectedOption={nationalities.find(n => n.id.toString() == participant.nationality_id.toString())}
                                    onSelect={(option) => handleInputChange(index, "nationality_id", option.id.toString())}
                                    placeholder="Select nationality..."
                                    hasError={!!errors[`participants.${index}.nationality_id`]}
                                    errorMessage={errors[`participants.${index}.nationality_id`]}
                                />

                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {participant.nationality_id == 101
                                        ? "KTP Number"
                                        : "Passport Number"}
                                </label>
                                <input
                                    type="text"
                                    value={participant.id_number || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "id_number",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full border ${
                                        validationErrors[`idNumber_${index}`] || errors[`participants.${index}.id_number`]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg p-3`}
                                    placeholder={
                                        participant.nationality_id == 101
                                            ? "16 digits"
                                            : "8-9 characters"
                                    }
                                />
                                {(validationErrors[`idNumber_${index}`] || errors[`participants.${index}.id_number`]) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {validationErrors[`idNumber_${index}`] || errors[`participants.${index}.id_number`]}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {participant.nationality_id == 101
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
                                onClick={() =>
                                    handleInputChange(
                                        index,
                                        "has_medical_history",
                                        !participant.has_medical_history
                                    )
                                }
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
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "allergies",
                                                e.target.value
                                            )
                                        }
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
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "past_medical_history",
                                                e.target.value
                                            )
                                        }
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
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "current_medications",
                                                e.target.value
                                            )
                                        }
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
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "family_medical_history",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        rows={2}
                                        placeholder="Any relevant family medical history"
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {data.participants.length < 10 && (
                <button
                    onClick={handleAddParticipant}
                    className="w-full mb-4 border-2 border-dashed border-green-300 text-green-500 py-3 rounded-xl font-medium flex items-center justify-center"
                >
                    <Plus size={20} className="mr-2" />
                    {t.addParticipant} ({data.participants.length}/10)
                </button>
            )}

            <button
                onClick={onNext}
                className={`w-full ${
                    canProceed()
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-500"
                } py-3 rounded-xl font-medium mb-6`}
                disabled={!canProceed()}
            >
                {t.next}
            </button>
        </div>
    </div>
);
};

export default ParticipantInfo;