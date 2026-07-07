import { SpecialtyMeta, MedInput } from "../types";

export const specialties: SpecialtyMeta[] = [
  {
    id: "nociceptive",
    label: "Nociceptive Pain",
    subtitle: "Somatic • Visceral • Acute",
    icon: "🔥",
    color: "#C0392B",
    borderColor: "#C0392B",
    textColor: "#7B241C",
    lightBg: "#FDEDEC",
  },
  {
    id: "neuropathic",
    label: "Neuropathic Pain",
    subtitle: "Peripheral • Central • Mixed",
    icon: "⚡",
    color: "#C0392B",
    borderColor: "#C0392B",
    textColor: "#7B241C",
    lightBg: "#FDEDEC",
  },
  {
    id: "cancer_pain",
    label: "Cancer Pain",
    subtitle: "WHO ladder • Palliative • Breakthrough",
    icon: "🎗️",
    color: "#C0392B",
    borderColor: "#C0392B",
    textColor: "#7B241C",
    lightBg: "#FDEDEC",
  },
  {
    id: "musculoskeletal",
    label: "Musculoskeletal Pain",
    subtitle: "Spine • Joint • Myofascial • Sports",
    icon: "🦴",
    color: "#C0392B",
    borderColor: "#C0392B",
    textColor: "#7B241C",
    lightBg: "#FDEDEC",
  },
  {
    id: "headache",
    label: "Headache & Migraine",
    subtitle: "Migraine • Cluster • Tension • Facial",
    icon: "🧠",
    color: "#C0392B",
    borderColor: "#C0392B",
    textColor: "#7B241C",
    lightBg: "#FDEDEC",
  },
  {
    id: "interventional",
    label: "Interventional Pain",
    subtitle: "Nerve blocks • Epidural • RF • SCS",
    icon: "💉",
    color: "#C0392B",
    borderColor: "#C0392B",
    textColor: "#7B241C",
    lightBg: "#FDEDEC",
  },
  {
    id: "chronic_pain",
    label: "Chronic Pain Syndrome",
    subtitle: "CRPS • Fibromyalgia • Psychosocial",
    icon: "🔄",
    color: "#C0392B",
    borderColor: "#C0392B",
    textColor: "#7B241C",
    lightBg: "#FDEDEC",
  },
  {
    id: "post_surgical",
    label: "Post-Surgical Pain",
    subtitle: "Acute post-op • Persistent surgical pain",
    icon: "🏥",
    color: "#C0392B",
    borderColor: "#C0392B",
    textColor: "#7B241C",
    lightBg: "#FDEDEC",
  },
];

export function getSpecialty(id: string): SpecialtyMeta | undefined {
  return specialties.find((s) => s.id === id);
}

export function buildSpecialtyContext(input: MedInput): string {
  const lines: string[] = [];
  const s = input.specialty_id;

  // Common pain fields
  if (input.pain_score) lines.push(`Pain score (NRS 0-10): ${input.pain_score}`);
  if (input.pain_character) lines.push(`Pain character: ${input.pain_character}`);
  if (input.pain_location) lines.push(`Pain location: ${input.pain_location}`);
  if (input.pain_radiation) lines.push(`Radiation: ${input.pain_radiation}`);
  if (input.pain_duration_chronic) lines.push(`Chronicity: ${input.pain_duration_chronic}`);
  if (input.aggravating_factors) lines.push(`Aggravating factors: ${input.aggravating_factors}`);
  if (input.relieving_factors) lines.push(`Relieving factors: ${input.relieving_factors}`);

  if (s === "nociceptive") {
    if (input.injury_type) lines.push(`Injury/cause: ${input.injury_type}`);
    if (input.tissue_involved) lines.push(`Tissue involved: ${input.tissue_involved}`);
    if (input.inflammation_signs) lines.push(`Signs of inflammation: ${input.inflammation_signs}`);
  }

  if (s === "neuropathic") {
    if (input.neuropathy_type) lines.push(`Neuropathy type: ${input.neuropathy_type}`);
    if (input.sensory_symptoms) lines.push(`Sensory symptoms: ${input.sensory_symptoms}`);
    if (input.dn4_score) lines.push(`DN4 score: ${input.dn4_score}`);
    if (input.nerve_conduction) lines.push(`NCS/EMG findings: ${input.nerve_conduction}`);
  }

  if (s === "cancer_pain") {
    if (input.cancer_type) lines.push(`Cancer type & stage: ${input.cancer_type}`);
    if (input.who_ladder_step) lines.push(`WHO ladder step: ${input.who_ladder_step}`);
    if (input.opioid_current) lines.push(`Current opioid: ${input.opioid_current}`);
    if (input.breakthrough_frequency) lines.push(`Breakthrough frequency/day: ${input.breakthrough_frequency}`);
    if (input.performance_status) lines.push(`ECOG performance status: ${input.performance_status}`);
  }

  if (s === "musculoskeletal") {
    if (input.msk_region) lines.push(`Region: ${input.msk_region}`);
    if (input.imaging_findings) lines.push(`Imaging: ${input.imaging_findings}`);
    if (input.radiculopathy) lines.push(`Radiculopathy/neurogenic: ${input.radiculopathy}`);
    if (input.physiotherapy_done) lines.push(`Physiotherapy tried: ${input.physiotherapy_done}`);
  }

  if (s === "headache") {
    if (input.headache_type) lines.push(`Headache type: ${input.headache_type}`);
    if (input.headache_frequency) lines.push(`Attack frequency/month: ${input.headache_frequency}`);
    if (input.aura) lines.push(`Aura: ${input.aura}`);
    if (input.mow_status) lines.push(`Medication overuse (MOW): ${input.mow_status}`);
    if (input.headache_disability) lines.push(`Disability (MIDAS/HIT-6): ${input.headache_disability}`);
  }

  if (s === "interventional") {
    if (input.procedure_planned) lines.push(`Planned procedure: ${input.procedure_planned}`);
    if (input.previous_procedures) lines.push(`Previous procedures: ${input.previous_procedures}`);
    if (input.imaging_guidance) lines.push(`Imaging guidance: ${input.imaging_guidance}`);
    if (input.anticoagulation) lines.push(`Anticoagulation status: ${input.anticoagulation}`);
  }

  if (s === "chronic_pain") {
    if (input.chronicity_years) lines.push(`Chronicity (years): ${input.chronicity_years}`);
    if (input.psychological_comorbidity) lines.push(`Psychological comorbidity: ${input.psychological_comorbidity}`);
    if (input.catastrophizing) lines.push(`Pain catastrophizing: ${input.catastrophizing}`);
    if (input.sleep_impact) lines.push(`Sleep impact: ${input.sleep_impact}`);
    if (input.functional_disability) lines.push(`Functional disability: ${input.functional_disability}`);
  }

  if (s === "post_surgical") {
    if (input.surgery_type) lines.push(`Surgery performed: ${input.surgery_type}`);
    if (input.surgery_date) lines.push(`Date of surgery: ${input.surgery_date}`);
    if (input.wound_healing) lines.push(`Wound healing status: ${input.wound_healing}`);
    if (input.pca_epidural) lines.push(`PCA/Epidural used: ${input.pca_epidural}`);
  }

  return lines.length > 0
    ? `== SPECIALTY FINDINGS (${getSpecialty(input.specialty_id)?.label || input.specialty_id}) ==\n${lines.join("\n")}`
    : "";
}
