import React from "react";
import { MedInput } from "../types";

interface SpecialtyFieldsProps {
  specialtyId: string;
  input: MedInput;
  onChange: (field: keyof MedInput, value: string) => void;
}

export const SpecialtyFields: React.FC<SpecialtyFieldsProps> = ({
  specialtyId,
  input,
  onChange,
}) => {
  const commonClass = "field";

  // Common pain fields rendered for all specialties
  const CommonPainFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4 mb-6">
      <div>
        <label className="label">Pain Score (NRS 0–10)</label>
        <select
          className={commonClass}
          value={input.pain_score || ""}
          onChange={(e) => onChange("pain_score", e.target.value)}
        >
          <option value="">Select score</option>
          {[...Array(11)].map((_, i) => (
            <option key={i} value={`${i}`}>{i} {i === 0 ? "— No pain" : i <= 3 ? "— Mild" : i <= 6 ? "— Moderate" : "— Severe"}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Pain Character</label>
        <select
          className={commonClass}
          value={input.pain_character || ""}
          onChange={(e) => onChange("pain_character", e.target.value)}
        >
          <option value="">Select type</option>
          <option value="Burning">Burning</option>
          <option value="Shooting / Electric shock">Shooting / Electric shock</option>
          <option value="Aching / Dull">Aching / Dull</option>
          <option value="Stabbing / Sharp">Stabbing / Sharp</option>
          <option value="Throbbing">Throbbing</option>
          <option value="Cramping">Cramping</option>
          <option value="Pins and needles">Pins and needles</option>
          <option value="Mixed / Variable">Mixed / Variable</option>
        </select>
      </div>
      <div>
        <label className="label">Duration of Current Episode</label>
        <input
          type="text"
          className={commonClass}
          placeholder="e.g. 6 months, 2 years"
          value={input.pain_duration_chronic || ""}
          onChange={(e) => onChange("pain_duration_chronic", e.target.value)}
        />
      </div>
      <div>
        <label className="label">Pain Location</label>
        <input
          type="text"
          className={commonClass}
          placeholder="e.g. Lower back, right knee, bilateral feet"
          value={input.pain_location || ""}
          onChange={(e) => onChange("pain_location", e.target.value)}
        />
      </div>
      <div>
        <label className="label">Radiation</label>
        <input
          type="text"
          className={commonClass}
          placeholder="e.g. Radiates to right leg, no radiation"
          value={input.pain_radiation || ""}
          onChange={(e) => onChange("pain_radiation", e.target.value)}
        />
      </div>
      <div>
        <label className="label">Aggravating / Relieving Factors</label>
        <input
          type="text"
          className={commonClass}
          placeholder="e.g. Worse on movement, better with rest/heat"
          value={input.aggravating_factors || ""}
          onChange={(e) => onChange("aggravating_factors", e.target.value)}
        />
      </div>
    </div>
  );

  if (specialtyId === "nociceptive") {
    return (
      <div>
        <CommonPainFields />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
          <div>
            <label className="label">Injury / Cause</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Road traffic accident, post-op, osteoarthritis"
              value={input.injury_type || ""}
              onChange={(e) => onChange("injury_type", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Tissue Involved</label>
            <select
              className={commonClass}
              value={input.tissue_involved || ""}
              onChange={(e) => onChange("tissue_involved", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Bone">Bone</option>
              <option value="Muscle">Muscle</option>
              <option value="Joint / Cartilage">Joint / Cartilage</option>
              <option value="Visceral (organ)">Visceral (organ)</option>
              <option value="Skin / Soft tissue">Skin / Soft tissue</option>
              <option value="Mixed / Multiple">Mixed / Multiple</option>
            </select>
          </div>
          <div>
            <label className="label">Signs of Inflammation</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Swelling, warmth, erythema, ESR/CRP elevated"
              value={input.inflammation_signs || ""}
              onChange={(e) => onChange("inflammation_signs", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (specialtyId === "neuropathic") {
    return (
      <div>
        <CommonPainFields />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className="label">Neuropathy Type</label>
            <select
              className={commonClass}
              value={input.neuropathy_type || ""}
              onChange={(e) => onChange("neuropathy_type", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Diabetic peripheral neuropathy">Diabetic peripheral neuropathy</option>
              <option value="Post-herpetic neuralgia">Post-herpetic neuralgia</option>
              <option value="Trigeminal neuralgia">Trigeminal neuralgia</option>
              <option value="Radiculopathy (cervical)">Radiculopathy (cervical)</option>
              <option value="Radiculopathy (lumbar)">Radiculopathy (lumbar)</option>
              <option value="Central post-stroke pain">Central post-stroke pain</option>
              <option value="CRPS Type I">CRPS Type I</option>
              <option value="CRPS Type II">CRPS Type II</option>
              <option value="Chemotherapy-induced neuropathy">Chemotherapy-induced neuropathy</option>
              <option value="Idiopathic peripheral neuropathy">Idiopathic peripheral neuropathy</option>
            </select>
          </div>
          <div>
            <label className="label">DN4 Score (0–10)</label>
            <select
              className={commonClass}
              value={input.dn4_score || ""}
              onChange={(e) => onChange("dn4_score", e.target.value)}
            >
              <option value="">Select</option>
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={`${n}`}>{n} {n >= 4 ? "— Neuropathic likely" : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Sensory Symptoms</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Allodynia, hyperalgesia, loss of sensation, paraesthesia"
              value={input.sensory_symptoms || ""}
              onChange={(e) => onChange("sensory_symptoms", e.target.value)}
            />
          </div>
          <div>
            <label className="label">NCS / EMG Findings</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Reduced SNAP amplitudes, axonal degeneration L4 root"
              value={input.nerve_conduction || ""}
              onChange={(e) => onChange("nerve_conduction", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (specialtyId === "cancer_pain") {
    return (
      <div>
        <CommonPainFields />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className="label">Cancer Type & Stage</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Carcinoma lung, Stage IIIB; metastatic breast cancer"
              value={input.cancer_type || ""}
              onChange={(e) => onChange("cancer_type", e.target.value)}
            />
          </div>
          <div>
            <label className="label">WHO Analgesic Ladder Step</label>
            <select
              className={commonClass}
              value={input.who_ladder_step || ""}
              onChange={(e) => onChange("who_ladder_step", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Step 1 — Non-opioid">Step 1 — Non-opioid (Paracetamol/NSAIDs)</option>
              <option value="Step 2 — Weak opioid">Step 2 — Weak opioid (Tramadol/Codeine)</option>
              <option value="Step 3 — Strong opioid">Step 3 — Strong opioid (Morphine/Oxycodone)</option>
              <option value="Refractory / Interventional">Refractory / Interventional needed</option>
            </select>
          </div>
          <div>
            <label className="label">Current Opioid (name + dose)</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Oral morphine 30mg SR BD, Fentanyl patch 50mcg/h"
              value={input.opioid_current || ""}
              onChange={(e) => onChange("opioid_current", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Breakthrough Dose Frequency / Day</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. 3–4 times/day breakthrough needed"
              value={input.breakthrough_frequency || ""}
              onChange={(e) => onChange("breakthrough_frequency", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">ECOG Performance Status</label>
            <select
              className={commonClass}
              value={input.performance_status || ""}
              onChange={(e) => onChange("performance_status", e.target.value)}
            >
              <option value="">Select</option>
              <option value="0 — Fully active">0 — Fully active</option>
              <option value="1 — Restricted strenuous activity">1 — Restricted strenuous activity</option>
              <option value="2 — Ambulatory, self-care, >50% awake">2 — Ambulatory, self-care, &gt;50% awake</option>
              <option value="3 — Limited self-care, >50% bedbound">3 — Limited self-care, &gt;50% bedbound</option>
              <option value="4 — Completely disabled, bedbound">4 — Completely disabled, bedbound</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (specialtyId === "musculoskeletal") {
    return (
      <div>
        <CommonPainFields />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className="label">Region / Joint Involved</label>
            <select
              className={commonClass}
              value={input.msk_region || ""}
              onChange={(e) => onChange("msk_region", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Lumbar spine">Lumbar spine</option>
              <option value="Cervical spine">Cervical spine</option>
              <option value="Thoracic spine">Thoracic spine</option>
              <option value="Knee">Knee</option>
              <option value="Hip">Hip</option>
              <option value="Shoulder">Shoulder</option>
              <option value="Ankle / Foot">Ankle / Foot</option>
              <option value="Multiple joints">Multiple joints</option>
              <option value="Myofascial / Diffuse">Myofascial / Diffuse</option>
            </select>
          </div>
          <div>
            <label className="label">Radiculopathy / Neurogenic Features</label>
            <select
              className={commonClass}
              value={input.radiculopathy || ""}
              onChange={(e) => onChange("radiculopathy", e.target.value)}
            >
              <option value="">Select</option>
              <option value="No radiculopathy">No radiculopathy</option>
              <option value="Clinical radiculopathy present">Clinical radiculopathy present</option>
              <option value="Neurogenic claudication">Neurogenic claudication</option>
              <option value="Myelopathy features">Myelopathy features</option>
            </select>
          </div>
          <div>
            <label className="label">Imaging Findings</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. L4-5 PIVD with right paracentral disc protrusion, MRI spine 2024"
              value={input.imaging_findings || ""}
              onChange={(e) => onChange("imaging_findings", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Physiotherapy Attempted</label>
            <select
              className={commonClass}
              value={input.physiotherapy_done || ""}
              onChange={(e) => onChange("physiotherapy_done", e.target.value)}
            >
              <option value="">Select</option>
              <option value="None tried">None tried</option>
              <option value="Tried, partial benefit">Tried, partial benefit</option>
              <option value="Tried, no benefit">Tried, no benefit</option>
              <option value="Ongoing physiotherapy">Ongoing physiotherapy</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (specialtyId === "headache") {
    return (
      <div>
        <CommonPainFields />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className="label">Headache Type</label>
            <select
              className={commonClass}
              value={input.headache_type || ""}
              onChange={(e) => onChange("headache_type", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Episodic migraine without aura">Episodic migraine without aura</option>
              <option value="Episodic migraine with aura">Episodic migraine with aura</option>
              <option value="Chronic migraine">Chronic migraine (≥15 days/month)</option>
              <option value="Tension-type headache">Tension-type headache</option>
              <option value="Cluster headache">Cluster headache</option>
              <option value="Medication overuse headache">Medication overuse headache (MOH)</option>
              <option value="New daily persistent headache">New daily persistent headache</option>
              <option value="Trigeminal autonomic cephalgia">Trigeminal autonomic cephalgia</option>
              <option value="Secondary headache">Secondary headache (cause identified)</option>
            </select>
          </div>
          <div>
            <label className="label">Attack Frequency / Month</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. 8 days/month, daily"
              value={input.headache_frequency || ""}
              onChange={(e) => onChange("headache_frequency", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Aura</label>
            <select
              className={commonClass}
              value={input.aura || ""}
              onChange={(e) => onChange("aura", e.target.value)}
            >
              <option value="">Select</option>
              <option value="No aura">No aura</option>
              <option value="Visual aura (scintillating scotoma)">Visual aura (scintillating scotoma)</option>
              <option value="Sensory aura">Sensory aura</option>
              <option value="Motor aura (hemiplegic)">Motor aura (hemiplegic migraine)</option>
              <option value="Brainstem aura">Brainstem aura</option>
            </select>
          </div>
          <div>
            <label className="label">Medication Overuse (MOW)</label>
            <select
              className={commonClass}
              value={input.mow_status || ""}
              onChange={(e) => onChange("mow_status", e.target.value)}
            >
              <option value="">Select</option>
              <option value="No overuse">No overuse</option>
              <option value="Triptan overuse (>10 days/month)">Triptan overuse (&gt;10 days/month)</option>
              <option value="Analgesic overuse (>15 days/month)">Analgesic overuse (&gt;15 days/month)</option>
              <option value="Opioid overuse">Opioid overuse</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Disability (MIDAS grade or HIT-6 score)</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. MIDAS Grade III (21 days lost), HIT-6 score 62"
              value={input.headache_disability || ""}
              onChange={(e) => onChange("headache_disability", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (specialtyId === "interventional") {
    return (
      <div>
        <CommonPainFields />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className="label">Planned / Requested Procedure</label>
            <select
              className={commonClass}
              value={input.procedure_planned || ""}
              onChange={(e) => onChange("procedure_planned", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Epidural steroid injection (caudal)">Epidural steroid injection (caudal)</option>
              <option value="Epidural steroid injection (transforaminal)">ESI (transforaminal)</option>
              <option value="Epidural steroid injection (interlaminar)">ESI (interlaminar)</option>
              <option value="Selective nerve root block">Selective nerve root block</option>
              <option value="Medial branch block (diagnostic)">Medial branch block (diagnostic)</option>
              <option value="Radiofrequency ablation (facet)">Radiofrequency ablation (facet joints)</option>
              <option value="Sacroiliac joint injection">Sacroiliac joint injection</option>
              <option value="Celiac plexus block">Celiac plexus block</option>
              <option value="Stellate ganglion block">Stellate ganglion block</option>
              <option value="Spinal cord stimulation trial">Spinal cord stimulation (SCS) trial</option>
              <option value="Intrathecal drug delivery">Intrathecal drug delivery</option>
              <option value="Trigger point injection">Trigger point injection</option>
              <option value="Botulinum toxin injection">Botulinum toxin injection</option>
            </select>
          </div>
          <div>
            <label className="label">Imaging Guidance Available</label>
            <select
              className={commonClass}
              value={input.imaging_guidance || ""}
              onChange={(e) => onChange("imaging_guidance", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Fluoroscopy (C-arm)">Fluoroscopy (C-arm)</option>
              <option value="CT guidance">CT guidance</option>
              <option value="Ultrasound guidance">Ultrasound guidance</option>
              <option value="Landmark / Blind">Landmark / Blind</option>
              <option value="Not yet decided">Not yet decided</option>
            </select>
          </div>
          <div>
            <label className="label">Previous Procedures (response)</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Caudal ESI x2 — 60% relief for 3 months"
              value={input.previous_procedures || ""}
              onChange={(e) => onChange("previous_procedures", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Anticoagulation Status</label>
            <select
              className={commonClass}
              value={input.anticoagulation || ""}
              onChange={(e) => onChange("anticoagulation", e.target.value)}
            >
              <option value="">Select</option>
              <option value="None / Not on anticoagulants">None / Not on anticoagulants</option>
              <option value="Aspirin only (low dose)">Aspirin only (low dose)</option>
              <option value="P2Y12 inhibitor">P2Y12 inhibitor (clopidogrel/ticagrelor)</option>
              <option value="DOAC (dabigatran/rivaroxaban/apixaban)">DOAC (dabigatran/rivaroxaban/apixaban)</option>
              <option value="Warfarin (INR controlled)">Warfarin (INR controlled)</option>
              <option value="LMWH">LMWH (therapeutic dose)</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (specialtyId === "chronic_pain") {
    return (
      <div>
        <CommonPainFields />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className="label">Chronicity (years)</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. 4 years, since 2019"
              value={input.chronicity_years || ""}
              onChange={(e) => onChange("chronicity_years", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Psychological Comorbidity</label>
            <select
              className={commonClass}
              value={input.psychological_comorbidity || ""}
              onChange={(e) => onChange("psychological_comorbidity", e.target.value)}
            >
              <option value="">Select</option>
              <option value="None identified">None identified</option>
              <option value="Depression">Depression</option>
              <option value="Anxiety disorder">Anxiety disorder</option>
              <option value="PTSD">PTSD</option>
              <option value="Somatoform / Functional disorder">Somatoform / Functional disorder</option>
              <option value="Multiple / complex">Multiple / complex</option>
            </select>
          </div>
          <div>
            <label className="label">Pain Catastrophizing</label>
            <select
              className={commonClass}
              value={input.catastrophizing || ""}
              onChange={(e) => onChange("catastrophizing", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Low">Low (PCS &lt;20)</option>
              <option value="Moderate">Moderate (PCS 20–30)</option>
              <option value="High">High (PCS &gt;30)</option>
              <option value="Not assessed">Not formally assessed</option>
            </select>
          </div>
          <div>
            <label className="label">Sleep Impact</label>
            <select
              className={commonClass}
              value={input.sleep_impact || ""}
              onChange={(e) => onChange("sleep_impact", e.target.value)}
            >
              <option value="">Select</option>
              <option value="No significant impact">No significant impact</option>
              <option value="Mild — occasional disruption">Mild — occasional disruption</option>
              <option value="Moderate — frequent waking">Moderate — frequent waking</option>
              <option value="Severe — non-restorative sleep">Severe — non-restorative sleep</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Functional Disability</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Unable to walk >100m, off work 6 months, ODSS/PDI score if available"
              value={input.functional_disability || ""}
              onChange={(e) => onChange("functional_disability", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (specialtyId === "post_surgical") {
    return (
      <div>
        <CommonPainFields />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className="label">Surgery Performed</label>
            <input
              type="text"
              className={commonClass}
              placeholder="e.g. Total knee replacement, open cholecystectomy, mastectomy"
              value={input.surgery_type || ""}
              onChange={(e) => onChange("surgery_type", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Date of Surgery</label>
            <input
              type="date"
              className={commonClass}
              value={input.surgery_date || ""}
              onChange={(e) => onChange("surgery_date", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Wound / Healing Status</label>
            <select
              className={commonClass}
              value={input.wound_healing || ""}
              onChange={(e) => onChange("wound_healing", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Healing well, no infection">Healing well, no infection</option>
              <option value="Delayed healing">Delayed healing</option>
              <option value="Wound infection present">Wound infection present</option>
              <option value="Wound fully healed">Wound fully healed</option>
            </select>
          </div>
          <div>
            <label className="label">PCA / Epidural Used Intra-op?</label>
            <select
              className={commonClass}
              value={input.pca_epidural || ""}
              onChange={(e) => onChange("pca_epidural", e.target.value)}
            >
              <option value="">Select</option>
              <option value="PCA morphine used">PCA morphine used</option>
              <option value="Epidural analgesia used">Epidural analgesia used</option>
              <option value="Both PCA and epidural">Both PCA and epidural</option>
              <option value="Neither — IV analgesia only">Neither — IV analgesia only</option>
              <option value="Not known">Not known</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
