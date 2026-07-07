export interface SpecialtyMeta {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  color: string;
  borderColor: string;
  textColor: string;
  lightBg: string;
}

export interface Medication {
  name: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  indication: string;
  caution: string;
  monitoring: string;
}

export interface Investigation {
  test: string;
  reason: string;
  when: string;
}

export interface MedPrescription {
  primary_diagnosis: string;
  secondary_diagnoses: string[];
  clinical_summary: string;
  urgency: "Routine" | "Urgent" | "Emergency";
  specialty_assessment: string;
  medications: Medication[];
  non_pharmacological: string[];
  investigations: Investigation[];
  referral?: string;
  follow_up_weeks: number;
  follow_up_advice: string;
  patient_education: string[];
  warning_signs: string[];
  confidence: number;
  disclaimer: string;
  // Pain Medicine specific
  pain_mechanism?: string;
  opioid_risk_assessment?: string;
  dose_escalation_plan?: string;
  tapering_plan?: string;
  interventional_plan?: string;
  multimodal_strategy?: string;
}

export interface MedInput {
  // Base clinical fields
  name: string;
  age: string;
  gender: string;
  occupation: string;
  chief_complaint: string;
  duration: string;
  clinical_findings: string;
  provisional_diagnosis: string;
  current_medications: string;
  allergies: string;
  notes: string;
  image?: string; // base64

  // Specialty-specific fields (all optional)
  specialty_id: string;

  // Common pain assessment
  pain_score?: string;
  pain_character?: string;
  pain_location?: string;
  pain_radiation?: string;
  pain_duration_chronic?: string;
  aggravating_factors?: string;
  relieving_factors?: string;

  // Nociceptive
  injury_type?: string;
  tissue_involved?: string;
  inflammation_signs?: string;

  // Neuropathic
  neuropathy_type?: string;
  sensory_symptoms?: string;
  dn4_score?: string;
  nerve_conduction?: string;

  // Cancer pain
  cancer_type?: string;
  who_ladder_step?: string;
  opioid_current?: string;
  breakthrough_frequency?: string;
  performance_status?: string;

  // Musculoskeletal
  msk_region?: string;
  imaging_findings?: string;
  radiculopathy?: string;
  physiotherapy_done?: string;

  // Headache
  headache_type?: string;
  headache_frequency?: string;
  aura?: string;
  mow_status?: string;
  headache_disability?: string;

  // Interventional
  procedure_planned?: string;
  previous_procedures?: string;
  imaging_guidance?: string;
  anticoagulation?: string;

  // Chronic pain
  chronicity_years?: string;
  psychological_comorbidity?: string;
  catastrophizing?: string;
  sleep_impact?: string;
  functional_disability?: string;

  // Post-surgical
  surgery_type?: string;
  surgery_date?: string;
  wound_healing?: string;
  pca_epidural?: string;
}

export interface SavedCase {
  id: string;
  timestamp: string;
  input: MedInput;
  rx: MedPrescription;
  specialty_label: string;
}
