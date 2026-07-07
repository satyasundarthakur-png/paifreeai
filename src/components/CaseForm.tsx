import React, { useState } from "react";
import { SpecialtySelector } from "./SpecialtySelector";
import { SpecialtyFields } from "./SpecialtyFields";
import { MedInput } from "../types";
import { getSpecialty } from "../lib/specialties";

interface CaseFormProps {
  input: MedInput;
  onInputChange: (field: keyof MedInput, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const CaseForm: React.FC<CaseFormProps> = ({ input, onInputChange, onSubmit, loading }) => {
  const [showImageInfo, setShowImageInfo] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onInputChange("image", base64);
      setShowImageInfo(true);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    onInputChange("image", "");
    setShowImageInfo(false);
  };

  const isFormValid = input.chief_complaint.trim().length > 5 && input.specialty_id;

  return (
    <div className="space-y-8">
      {/* Specialty Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="section-title">1. Select Pain Medicine Subspecialty</div>
            <p className="text-sm text-[#7B241C]">Choose the pain subspecialty for this consultation</p>
          </div>
          {input.specialty_id && (
            <div className="px-4 py-1.5 bg-[#FEE2E2] text-[#C0392B] text-sm font-bold rounded-full border border-[#C0392B]/30">
              {getSpecialty(input.specialty_id)?.label || 'Pain'}
            </div>
          )}
        </div>
        <SpecialtySelector
          selectedId={input.specialty_id}
          onSelect={(id) => onInputChange("specialty_id", id)}
        />
      </div>

      {/* Demographics */}
      <div>
        <div className="section-title">2. Patient Demographics</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="field"
              placeholder="e.g. Ramesh Kumar"
              value={input.name}
              onChange={(e) => onInputChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Age (years)</label>
            <input
              type="text"
              className="field"
              placeholder="52"
              value={input.age}
              onChange={(e) => onInputChange("age", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Gender</label>
            <select
              className="field"
              value={input.gender}
              onChange={(e) => onInputChange("gender", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Occupation</label>
            <input
              type="text"
              className="field"
              placeholder="e.g. Software engineer, Farmer"
              value={input.occupation}
              onChange={(e) => onInputChange("occupation", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Clinical Presentation */}
      <div>
        <div className="section-title">3. Clinical Presentation</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">
              Chief Complaint <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="field"
              placeholder="e.g. Severe low back pain radiating to right leg, not responding to NSAIDs"
              value={input.chief_complaint}
              onChange={(e) => onInputChange("chief_complaint", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Duration of Current Problem</label>
            <input
              type="text"
              className="field"
              placeholder="e.g. 8 months, acute on chronic, 2 years of back pain"
              value={input.duration}
              onChange={(e) => onInputChange("duration", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Provisional Diagnosis (if any)</label>
            <input
              type="text"
              className="field"
              placeholder="e.g. Type 2 DM with poor control, possible LADA"
              value={input.provisional_diagnosis}
              onChange={(e) => onInputChange("provisional_diagnosis", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Clinical Findings & Examination</label>
            <textarea
              className="field min-h-[92px]"
              placeholder="e.g. BMI 29.4, BP 138/86, fundus moderate NPDR, monofilament reduced bilaterally, no edema, HbA1c 8.9% last month"
              value={input.clinical_findings}
              onChange={(e) => onInputChange("clinical_findings", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Specialty-specific fields */}
      {input.specialty_id && (
        <div>
          <div className="section-title">
            4. {getSpecialty(input.specialty_id)?.label || 'Pain'} Specific Findings
          </div>
          <SpecialtyFields
            specialtyId={input.specialty_id}
            input={input}
            onChange={onInputChange}
          />
        </div>
      )}

      {/* Medications & Allergies */}
      <div>
        <div className="section-title">5. Current Medications & Allergies</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Current Medications (name + dose + frequency)</label>
            <textarea
              className="field min-h-[86px]"
              placeholder="Metformin 1g BD&#10;Glimepiride 2mg OD&#10;Atorvastatin 20mg HS&#10;Insulin Glargine 24U bedtime"
              value={input.current_medications}
              onChange={(e) => onInputChange("current_medications", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Allergies / Intolerances</label>
            <textarea
              className="field min-h-[86px]"
              placeholder="e.g. Penicillin rash, Sulfonamide allergy, No known drug allergies"
              value={input.allergies}
              onChange={(e) => onInputChange("allergies", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Additional Notes + Image */}
      <div>
        <div className="section-title">6. Additional Notes & Clinical Image (optional)</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3">
            <label className="label">Additional Notes / Context</label>
            <textarea
              className="field min-h-[92px]"
              placeholder="e.g. Patient is highly motivated but struggles with dawn phenomenon. Works night shifts. Wife is also diabetic."
              value={input.notes}
              onChange={(e) => onInputChange("notes", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Upload Clinical Image (retina / foot / skin)</label>
            <div className="border-2 border-dashed border-[#FCA5A5] rounded-2xl p-4 text-center hover:border-[#C0392B] transition-colors">
              {!input.image ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center py-3"
                  >
                    <div className="text-3xl mb-2">📷</div>
                    <div className="text-sm font-semibold text-[#C0392B]">
                      Click to upload image
                    </div>
                    <div className="text-xs text-[#7B241C] mt-1">
                      MRI, X-ray, wound photo, nerve diagram etc.
                    </div>
                  </label>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-green-600 text-sm font-bold mb-1">✓ Image attached</div>
                  <button onClick={removeImage} className="text-xs text-red-600 hover:underline">
                    Remove image
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-[#7B241C] mt-1.5">
              Image is analyzed directly by the AI model alongside your clinical notes.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#FECACA]">
        <button
          onClick={onSubmit}
          disabled={!isFormValid || loading}
          className="btn-primary w-full md:w-auto text-lg px-14 py-4 disabled:opacity-60"
        >
          {loading ? "Generating Pain Management Plan..." : "Generate AI Pain Plan & Prescription →"}
        </button>

        {!isFormValid && (
          <p className="text-sm text-[#7B241C] mt-3">
            Please select a subspecialty and enter a chief complaint (min 6 characters) to enable
            generation.
          </p>
        )}
      </div>
    </div>
  );
};
