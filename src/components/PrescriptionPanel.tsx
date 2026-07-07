import React from "react";
import { MedInput, MedPrescription } from "../types";
import { exportToWord } from "../lib/wordExport";
import { exportToPdf } from "../lib/pdfExport";
import { FileDown, FileText, RotateCcw, User, Calendar } from "lucide-react";

interface PrescriptionPanelProps {
  input: MedInput;
  rx: MedPrescription;
  onNewCase: () => void;
}

export const PrescriptionPanel: React.FC<PrescriptionPanelProps> = ({ input, rx, onNewCase }) => {
  const urgencyColor =
    rx.urgency === "Routine" ? "routine" : rx.urgency === "Urgent" ? "urgent" : "emergency";

  const handleWordExport = () => {
    exportToWord(input, rx, "PainAI", "C0392B", "1A0A0A");
  };

  const handlePdfExport = () => {
    exportToPdf(input, rx, "PainAI", "C0392B", "1A0A0A");
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header Card */}
      <div className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-4xl">🩻</div>
            <div>
              <div className="text-2xl font-extrabold tracking-tight">Prescription Generated</div>
              <div className="text-[#746240] text-sm">AI Pain Plan • Always verify clinically</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-5 py-2 rounded-2xl text-sm font-extrabold border ${urgencyColor === "routine" ? "bg-green-50 text-green-700 border-green-200" : urgencyColor === "urgent" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}
          >
            {rx.urgency.toUpperCase()} PRIORITY
          </div>
          <div className="px-4 py-2 bg-[#FBF3DC] rounded-2xl text-sm font-bold text-[#C9A227] border border-[#C9A227]/30">
            Confidence: {rx.confidence || 82}%
          </div>
        </div>
      </div>

      {/* Diagnosis & Summary */}
      <div className="card p-6">
        <div className="section-title">PRIMARY DIAGNOSIS</div>
        <div className="text-xl font-extrabold text-[#241A10] mb-3">{rx.primary_diagnosis}</div>

        {rx.secondary_diagnoses.length > 0 && (
          <div className="mb-4">
            <span className="font-semibold text-sm text-[#746240]">Secondary:</span>{" "}
            <span className="text-[#241A10]">{rx.secondary_diagnoses.join(" • ")}</span>
          </div>
        )}

        <div className="section-title mt-5">CLINICAL SUMMARY</div>
        <p className="text-[15px] leading-relaxed text-[#241A10]">{rx.clinical_summary}</p>
      </div>

      {/* Specialty Assessment */}
      <div className="card p-6">
        <div className="section-title">SPECIALTY ASSESSMENT</div>
        <p className="text-[15px] leading-relaxed text-[#241A10]">{rx.specialty_assessment}</p>
      </div>

      {/* Medications Table */}
      <div className="card p-6">
        <div className="section-title flex items-center justify-between">
          <span>MEDICATIONS</span>
          <span className="text-xs font-normal text-[#746240]">
            Prescribed by AI • Review doses
          </span>
        </div>

        {rx.medications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full med-table text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 rounded-tl-xl">Medication</th>
                  <th className="text-left py-3 px-3">Dose</th>
                  <th className="text-left py-3 px-3">Route</th>
                  <th className="text-left py-3 px-3">Frequency</th>
                  <th className="text-left py-3 px-3">Duration</th>
                  <th className="text-left py-3 px-4 rounded-tr-xl">Caution & Monitoring</th>
                </tr>
              </thead>
              <tbody>
                {rx.medications.map((med, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-[#FBF3DC]/40" : "bg-white"}>
                    <td className="py-3 px-4 font-semibold">{med.name}</td>
                    <td className="py-3 px-3">{med.dose}</td>
                    <td className="py-3 px-3">{med.route}</td>
                    <td className="py-3 px-3">{med.frequency}</td>
                    <td className="py-3 px-3">{med.duration}</td>
                    <td className="py-3 px-4 text-xs text-[#746240]">
                      {med.caution}. {med.monitoring}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm italic text-[#746240]">No new medications added in this plan.</p>
        )}
      </div>

      {/* Two column: Investigations + Non-pharm */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="section-title">INVESTIGATIONS</div>
          {rx.investigations.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {rx.investigations.map((inv, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#C9A227] mt-0.5">→</span>
                  <span>
                    <strong>{inv.test}</strong> — {inv.reason}{" "}
                    <span className="text-[#746240]">({inv.when})</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#746240]">No additional tests recommended.</p>
          )}
        </div>

        <div className="card p-6">
          <div className="section-title">NON-PHARMACOLOGICAL</div>
          {rx.non_pharmacological.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {rx.non_pharmacological.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#C9A227] mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#746240]">Continue current lifestyle measures.</p>
          )}
        </div>
      </div>

      {/* Education + Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="section-title">PATIENT EDUCATION</div>
          <ul className="space-y-2 text-sm">
            {rx.patient_education.length > 0 ? (
              rx.patient_education.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#C9A227]">✓</span> {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-[#746240]">
                Standard diabetes self-management education reinforced.
              </li>
            )}
          </ul>
        </div>

        <div className="card p-6 border-red-200 bg-red-50/30">
          <div className="section-title text-red-700">⚠ WARNING SIGNS — REPORT IMMEDIATELY</div>
          <ul className="space-y-2 text-sm text-red-700 font-medium">
            {rx.warning_signs.length > 0 ? (
              rx.warning_signs.map((item, i) => <li key={i}>• {item}</li>)
            ) : (
              <li>
                • Severe hypoglycemia (needs assistance)
                <br />• Symptoms of DKA (nausea, vomiting, abdominal pain, rapid breathing)
                <br />• Chest pain or sudden breathlessness
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Pain Medicine Specific Fields */}
      {(rx.pain_mechanism || rx.opioid_risk_assessment || rx.multimodal_strategy || rx.interventional_plan || rx.dose_escalation_plan || rx.tapering_plan) && (
        <div className="card p-6 bg-[#FFF0F0]/60 border-[#C0392B]/20">
          <div className="section-title">PAIN MEDICINE — CLINICAL STRATEGY</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {rx.pain_mechanism && (
              <div>
                <div className="font-bold text-[#7B241C] mb-1">Pain Mechanism</div>
                <div>{rx.pain_mechanism}</div>
              </div>
            )}
            {rx.opioid_risk_assessment && (
              <div>
                <div className="font-bold text-[#7B241C] mb-1">Opioid Risk Assessment</div>
                <div>{rx.opioid_risk_assessment}</div>
              </div>
            )}
            {rx.multimodal_strategy && (
              <div className="md:col-span-2">
                <div className="font-bold text-[#7B241C] mb-1">Multimodal Strategy</div>
                <div>{rx.multimodal_strategy}</div>
              </div>
            )}
            {rx.interventional_plan && (
              <div className="md:col-span-2">
                <div className="font-bold text-[#7B241C] mb-1">Interventional Plan</div>
                <div>{rx.interventional_plan}</div>
              </div>
            )}
            {rx.dose_escalation_plan && (
              <div>
                <div className="font-bold text-[#7B241C] mb-1">Dose Escalation Plan</div>
                <div>{rx.dose_escalation_plan}</div>
              </div>
            )}
            {rx.tapering_plan && (
              <div>
                <div className="font-bold text-[#7B241C] mb-1">Tapering Plan</div>
                <div>{rx.tapering_plan}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Follow-up & Referral */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <div className="font-extrabold text-lg">
              Follow-up in <span className="text-[#C0392B]">{rx.follow_up_weeks}</span> weeks
            </div>
            <div className="text-[#241A10] mt-1">{rx.follow_up_advice}</div>
          </div>
          {rx.referral && (
            <div className="px-5 py-2 bg-white border border-[#C0392B] rounded-2xl text-sm font-semibold">
              Referral: {rx.referral}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-center text-[#746240] italic px-6">
        {rx.disclaimer ||
          "This is an AI-assisted draft. Final clinical decisions, prescriptions, and responsibility rest with the treating physician. Always cross-check with current ADA/EASD guidelines and patient context."}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={handleWordExport}
          className="btn-primary flex-1 justify-center text-base py-4"
        >
          <FileDown className="w-5 h-5" /> Download Word Document
        </button>
        <button
          onClick={handlePdfExport}
          className="btn-primary flex-1 justify-center text-base py-4"
        >
          <FileText className="w-5 h-5" /> Download PDF
        </button>
        <button onClick={onNewCase} className="btn-ghost flex-1 justify-center text-base py-4">
          <RotateCcw className="w-5 h-5" /> Start New Case
        </button>
      </div>
    </div>
  );
};
