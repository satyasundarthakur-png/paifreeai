import { MedInput, MedPrescription } from "../types";
import { buildSpecialtyContext, getSpecialty } from "./specialties";

export function buildPrompt(input: MedInput): string {
  const specialty = getSpecialty(input.specialty_id);
  const specialtyContext = buildSpecialtyContext(input);

  const imageNote = input.image
    ? `\n== CLINICAL IMAGE ==\nA clinical image (MRI, X-ray, wound, nerve diagram, etc.) is attached below. Visually examine it and correlate your findings with the clinical history above when forming the diagnosis and management plan.`
    : "";

  return `You are a senior Pain Medicine consultant with 20+ years of experience managing acute, chronic, cancer, and interventional pain. You follow current IASP, British Pain Society, Indian Academy of Pain Medicine, and WHO guidelines (2024-2025).

== PATIENT ==
Name: ${input.name || "Not provided"}
Age: ${input.age || "Not provided"} years
Gender: ${input.gender || "Not provided"}
Occupation: ${input.occupation || "Not provided"}

== CHIEF COMPLAINT ==
${input.chief_complaint || "Not provided"}
Duration: ${input.duration || "Not provided"}

== CLINICAL FINDINGS ==
${input.clinical_findings || "Not provided"}

== PROVISIONAL DIAGNOSIS ==
${input.provisional_diagnosis || "Not provided"}

== CURRENT MEDICATIONS ==
${input.current_medications || "None reported"}

== ALLERGIES / NOTES ==
Allergies: ${input.allergies || "None known"}
Additional notes: ${input.notes || "None"}

${specialtyContext}
${imageNote}

== PAIN MEDICINE FORMULARY & INTERVENTION REFERENCE (apply clinical judgement, cost, access, and opioid stewardship) ==
Analgesic ladder: Paracetamol, NSAIDs (COX-selective for GI/CV risk), weak opioids (tramadol, codeine), strong opioids (morphine, oxycodone, fentanyl, buprenorphine), tapentadol (mixed MOR agonist + NRI).
Neuropathic agents: Pregabalin, gabapentin (titrate slowly), duloxetine (first-line for DPNP & MSK), amitriptyline (low-dose adjuvant), lidocaine patch (5%).
Cancer pain: Immediate-release oral morphine for titration, long-acting formulation for maintenance, breakthrough dose = 1/6 of total daily dose; add adjuvants (dexamethasone, bisphosphonates for bone pain, ketamine infusion for refractory).
Interventional options: Epidural steroid injection, selective nerve root block, medial branch block, radiofrequency ablation, spinal cord stimulation (SCS), intrathecal drug delivery, ganglion blocks (celiac, stellate, SHG).
Migraine: Triptans (sumatriptan, rizatriptan) for acute; prophylaxis: propranolol, amitriptyline, topiramate, CGRP antagonists (erenumab) for frequent episodic/chronic migraine.
Multimodal analgesia: Combine agents with different mechanisms to reduce opioid requirements; always assess opioid risk (ORT/DIRE score) before initiating.
Opioid stewardship: Use lowest effective dose, monitor for dependence, prescribe naloxone co-prescription where appropriate, taper plan mandatory on discontinuation.
Special populations: Renal/hepatic dose adjustments critical; avoid NSAIDs in elderly/CKD; buprenorphine preferred in severe renal impairment.

Respond ONLY with valid JSON — no markdown, no backticks, no explanations outside the JSON object.

The JSON must strictly follow this schema:
{
  "primary_diagnosis": "ICD-11 code + full name (e.g. MG30.0 Chronic primary musculoskeletal pain)",
  "secondary_diagnoses": ["array of secondary diagnoses with ICD-11 if applicable"],
  "clinical_summary": "2-3 sentence concise clinical summary",
  "urgency": "Routine | Urgent | Emergency",
  "specialty_assessment": "Detailed pain medicine assessment focused on the selected subspecialty (${specialty?.label || "Pain Medicine"}), including pain mechanism and biopsychosocial factors",
  "medications": [
    {
      "name": "Drug name",
      "dose": "e.g. 75 mg or 10 mcg/h",
      "route": "Oral / Topical / SC / IV / Epidural / Transdermal",
      "frequency": "e.g. Once daily / BD / TDS / PRN",
      "duration": "e.g. 2 weeks / Ongoing / Review at 4 weeks",
      "indication": "Why prescribed — analgesic mechanism",
      "caution": "Key cautions or contraindications",
      "monitoring": "What to monitor (pain score, side effects, labs)"
    }
  ],
  "non_pharmacological": ["array of physical, psychological, rehabilitative, and lifestyle recommendations"],
  "investigations": [
    {
      "test": "Test name",
      "reason": "Clinical reason",
      "when": "e.g. Baseline / Before procedure / In 4 weeks / Annually"
    }
  ],
  "referral": "Specialist referral if needed (e.g. Neurosurgery, Psychiatry, Physiotherapy, Palliative Care) or null",
  "follow_up_weeks": 4,
  "follow_up_advice": "Clear follow-up instructions including pain reassessment parameters",
  "patient_education": ["array of key education points about pain management, expectations, and self-care"],
  "warning_signs": ["array of red-flag symptoms to report immediately — including opioid side effects if applicable"],
  "confidence": 85,
  "disclaimer": "This is an AI-assisted draft for qualified pain medicine clinicians. Final decisions rest with the treating physician.",
  "pain_mechanism": "Nociceptive / Neuropathic / Nociplastic / Mixed — detailed mechanistic assessment",
  "opioid_risk_assessment": "Risk stratification if opioids used (low/moderate/high risk with rationale) or N/A",
  "dose_escalation_plan": "Step-wise dose titration instructions if applicable",
  "tapering_plan": "Tapering strategy if chronic opioids or high-dose analgesics are being reduced",
  "interventional_plan": "Recommended interventional procedures with timing and rationale, or null",
  "multimodal_strategy": "How the prescribed medications work together across different pain pathways"
}`;
}
