import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MedInput, MedPrescription } from "../types";

type JsPDFWithAutoTable = jsPDF & { lastAutoTable: { finalY: number } };

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// jsPDF's built-in fonts (Helvetica etc.) only support the WinAnsi character set.
// The AI and the prompt sometimes generate characters outside that set, causing
// jsPDF to silently switch text encoding mid-string, which corrupts glyph widths
// and makes text overflow or render as null bytes in the PDF viewer.
// Solution: keep ONLY ASCII printable (0x20–0x7E) plus a few safe extended chars
// that jsPDF's WinAnsi definitely covers: —, –, ", ", ', ', …, °, ², ±, ×, µ
// Everything else gets stripped or replaced.
const SAFE_EXTENDED_CHARS = "—–…°²±×µ\u201C\u201D\u2018\u2019\u201E";
const ASCII_PRINTABLE_RANGE = /[ -~]/;

function sanitizeForPdf(text: string | undefined | null): string {
  if (!text) return "";
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);
    // Keep ASCII printable (space through tilde)
    if (code >= 0x20 && code <= 0x7e) {
      out += ch;
    } else if (SAFE_EXTENDED_CHARS.includes(ch)) {
      // Keep a few safe extended chars that render fine
      out += ch;
    } else if (code === 0x0a || code === 0x0d) {
      // Preserve newlines
      out += ch;
    } else {
      // Replace everything else with a safe equivalent or drop it
      switch (ch) {
        case "\u2265":
          out += ">=";
          break;
        case "\u2264":
          out += "<=";
          break;
        case "\u2192":
          out += "->";
          break;
        case "\u2190":
          out += "<-";
          break;
        case "\u2194":
          out += "<->";
          break;
        case "\u00ad": // soft hyphen
          out += "-";
          break;
        case "\u00a0": // non-breaking space
          out += " ";
          break;
        default:
          // Drop any other character silently
          break;
      }
    }
  }
  return out;
}

export async function exportToPdf(
  input: MedInput,
  rx: MedPrescription,
  appName: string = "PainAI",
  accentHex: string = "B7950B",
  headerHex: string = "3D2B1F",
): Promise<void> {
  const accent = hexToRgb(accentHex);
  const header = hexToRgb(headerHex);
  const muted: [number, number, number] = [107, 91, 63];
  const danger: [number, number, number] = [220, 38, 38];

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 50;

  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const specialtyLabel = input.specialty_id
    ? input.specialty_id === "t1dm"
      ? "Type 1 Pain Medicine"
      : input.specialty_id === "t2dm"
        ? "Type 2 Pain Medicine"
        : input.specialty_id === "gdm"
          ? "Gestational Pain Medicine"
          : input.specialty_id === "hypoglycemia"
            ? "Hypoglycemia Management"
            : input.specialty_id === "complications"
              ? "Diabetic Complications"
              : input.specialty_id === "technology"
                ? "Pain Medicine Technology"
                : input.specialty_id === "lifestyle"
                  ? "Lifestyle & Nutrition"
                  : input.specialty_id === "education"
                    ? "Education & Prevention"
                    : "Pain Medicine"
    : "Pain Medicine";

  const addPageIfNeeded = (needed: number) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - 60) {
      doc.addPage();
      y = 50;
    }
  };

  const sectionTitle = (text: string) => {
    addPageIfNeeded(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...accent);
    doc.text(sanitizeForPdf(text), marginX, y);
    y += 16;
    doc.setTextColor(0, 0, 0);
  };

  const bodyText = (
    text: string,
    options: { color?: [number, number, number]; bold?: boolean; size?: number } = {},
  ) => {
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(options.size ?? 10.5);
    doc.setTextColor(...(options.color ?? [0, 0, 0]));
    const usableWidth = pageWidth - marginX * 2;
    const lines = doc.splitTextToSize(sanitizeForPdf(text), usableWidth);
    for (const line of lines) {
      addPageIfNeeded(14);
      doc.text(line, marginX, y);
      y += 14;
    }
    doc.setTextColor(0, 0, 0);
  };

  const bulletList = (
    items: string[],
    fallback: string,
    options: { color?: [number, number, number]; bold?: boolean } = {},
  ) => {
    const list = items.length > 0 ? items : [fallback];
    list.forEach((item) => bodyText(`•  ${item}`, options));
  };

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...accent);
  doc.text(sanitizeForPdf(appName), pageWidth / 2, y, { align: "center" });
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...muted);
  doc.text("AI-Assisted Pain Medicine Prescription & Management Plan", pageWidth / 2, y, {
    align: "center",
  });
  y += 18;

  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text(sanitizeForPdf(`Date: ${today}  |  Specialty: ${specialtyLabel}`), pageWidth / 2, y, {
    align: "center",
  });
  y += 28;
  doc.setTextColor(0, 0, 0);

  // Patient Information
  sectionTitle("PATIENT INFORMATION");
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: "plain",
    body: [
      ["Patient Name", sanitizeForPdf(input.name) || "-"],
      ["Age / Gender", sanitizeForPdf(`${input.age || "-"} years / ${input.gender || "-"}`)],
      ["Occupation", sanitizeForPdf(input.occupation) || "-"],
      ["Specialty Focus", specialtyLabel],
      ["Chief Complaint", sanitizeForPdf(input.chief_complaint) || "-"],
      ["Duration", sanitizeForPdf(input.duration) || "-"],
      ["Current Medications", sanitizeForPdf(input.current_medications) || "None"],
      ["Allergies", sanitizeForPdf(input.allergies) || "None known"],
    ],
    styles: { fontSize: 9.5, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: muted, cellWidth: 150 },
      1: { textColor: [0, 0, 0] },
    },
  });
  y = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 20;

  // Diagnosis
  sectionTitle("DIAGNOSIS");
  bodyText(`Primary: ${rx.primary_diagnosis}`, { bold: true });
  if (rx.secondary_diagnoses.length > 0) {
    bodyText(`Secondary: ${rx.secondary_diagnoses.join(" • ")}`);
  }
  const urgencyColor: [number, number, number] =
    rx.urgency === "Routine"
      ? [22, 163, 74]
      : rx.urgency === "Urgent"
        ? [217, 119, 6]
        : [220, 38, 38];
  bodyText(`Urgency: ${rx.urgency.toUpperCase()}`, { bold: true, color: urgencyColor });
  y += 6;

  // Clinical Summary
  sectionTitle("CLINICAL SUMMARY");
  bodyText(rx.clinical_summary);
  y += 6;

  // Specialty Assessment
  sectionTitle("SPECIALTY ASSESSMENT");
  bodyText(rx.specialty_assessment);
  y += 6;

  // Medications
  sectionTitle("MEDICATIONS");
  if (rx.medications.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [["Medication", "Dose", "Route", "Frequency", "Duration", "Caution & Monitoring"]],
      body: rx.medications.map((m) => [
        sanitizeForPdf(m.name),
        sanitizeForPdf(m.dose),
        sanitizeForPdf(m.route),
        sanitizeForPdf(m.frequency),
        sanitizeForPdf(m.duration),
        sanitizeForPdf(`${m.caution}. ${m.monitoring}`),
      ]),
      styles: { fontSize: 8.5, cellPadding: 4 },
      headStyles: { fillColor: accent, textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [254, 249, 231] },
    });
    y = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 16;
  } else {
    bodyText("No medications prescribed in this plan.");
    y += 6;
  }

  // Investigations
  sectionTitle("INVESTIGATIONS");
  if (rx.investigations.length > 0) {
    rx.investigations.forEach((inv) => bodyText(`•  ${inv.test} — ${inv.reason} (${inv.when})`));
  } else {
    bodyText("No additional investigations recommended at this time.");
  }
  y += 6;

  // Non-pharmacological
  sectionTitle("NON-PHARMACOLOGICAL RECOMMENDATIONS");
  bulletList(rx.non_pharmacological, "Continue current lifestyle measures.");
  y += 6;

  // Patient Education
  sectionTitle("PATIENT EDUCATION");
  bulletList(rx.patient_education, "Standard pain medicine self-management education provided.");
  y += 6;

  // Warning signs
  sectionTitle("WARNING SIGNS — REPORT IMMEDIATELY");
  doc.setTextColor(...danger);
  bulletList(
    rx.warning_signs,
    "Seek immediate care for severe hypoglycemia, DKA symptoms, or chest pain.",
    { color: danger, bold: rx.warning_signs.length > 0 },
  );
  doc.setTextColor(0, 0, 0);
  y += 6;

  // Follow-up
  sectionTitle("FOLLOW-UP");
  bodyText(`Review in ${rx.follow_up_weeks} weeks. ${rx.follow_up_advice}`);
  if (rx.referral) bodyText(`Referral: ${rx.referral}`);
  y += 6;

  // Pain Medicine-specific targets
  if (rx.hba1c_target || rx.dose_titration_plan || rx.sick_day_rules) {
    sectionTitle("DIABETES-SPECIFIC TARGETS & RULES");
    if (rx.hba1c_target) bodyText(`HbA1c Target: ${rx.hba1c_target}`);
    if (rx.dose_titration_plan) bodyText(`Dose Titration Plan: ${rx.dose_titration_plan}`);
    if (rx.sick_day_rules) bodyText(`Sick Day Rules: ${rx.sick_day_rules}`);
    y += 6;
  }

  // Disclaimer
  addPageIfNeeded(40);
  y += 10;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(119, 119, 119);
  const disclaimer =
    rx.disclaimer ||
    "This is an AI-assisted draft prescription. All clinical decisions and final prescriptions remain the sole responsibility of the treating physician. Always verify with current guidelines and patient-specific factors.";
  const disclaimerLines = doc.splitTextToSize(sanitizeForPdf(disclaimer), pageWidth - marginX * 2);
  disclaimerLines.forEach((line: string) => {
    doc.text(line, pageWidth - marginX, y, { align: "right" });
    y += 11;
  });
  doc.setTextColor(0, 0, 0);

  // Doctor sign-off block
  addPageIfNeeded(100);
  y += 24;
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.75);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 22;

  const colGap = 20;
  const colWidth = (pageWidth - marginX * 2 - colGap) / 2;
  const leftX = marginX;
  const rightX = marginX + colWidth + colGap;
  const fieldLineY = y + 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Treating Physician: Dr. ____________________________", leftX, fieldLineY);
  doc.text("Signature: ____________________________", rightX, fieldLineY);

  const fieldLine2Y = fieldLineY + 26;
  doc.text("Registration No: ____________________________", leftX, fieldLine2Y);
  doc.text(`Date: ${today}`, rightX, fieldLine2Y);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(119, 119, 119);
  doc.text(sanitizeForPdf(`Draft generated by ${appName}`), leftX, fieldLine2Y + 18);
  y = fieldLine2Y + 18;

  // Header/footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...accent);
    doc.text(sanitizeForPdf(`${appName} • AI Pain Medicine Prescription`), pageWidth / 2, 25, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(136, 136, 136);
    doc.text(
      `Confidential • For clinical use only • Generated on ${today}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" },
    );
  }

  const filename = `${appName}_${(input.name || "Patient").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
