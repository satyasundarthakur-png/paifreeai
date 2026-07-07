import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  TextRun,
  AlignmentType,
  BorderStyle,
  WidthType,
  Packer,
} from "docx";
import { MedInput, MedPrescription } from "../types";

export async function exportToWord(
  input: MedInput,
  rx: MedPrescription,
  appName: string = "PainAI",
  accentHex: string = "B7950B",
  headerHex: string = "3D2B1F",
): Promise<void> {
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

  const noBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "EDE6D6" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  // Patient info table rows
  const patientRows = [
    ["Patient Name", input.name || "—"],
    ["Age / Gender", `${input.age || "—"} years / ${input.gender || "—"}`],
    ["Occupation", input.occupation || "—"],
    ["Specialty Focus", specialtyLabel],
    ["Chief Complaint", input.chief_complaint || "—"],
    ["Duration", input.duration || "—"],
    ["Current Medications", input.current_medications || "None"],
    ["Allergies", input.allergies || "None known"],
  ].map(
    ([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: label, bold: true, size: 20, color: "6B5B3F" })],
              }),
            ],
            width: { size: 2800, type: WidthType.DXA },
            borders: noBorders,
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: value, size: 20 })] })],
            width: { size: 7000, type: WidthType.DXA },
            borders: noBorders,
          }),
        ],
      }),
  );

  // Medications table
  const medBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: accentHex },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: accentHex },
    left: { style: BorderStyle.SINGLE, size: 1, color: accentHex },
    right: { style: BorderStyle.SINGLE, size: 1, color: accentHex },
  };

  const medHeaderRow = new TableRow({
    children: ["Medication", "Dose", "Route", "Frequency", "Duration", "Caution & Monitoring"].map(
      (header) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: header, bold: true, size: 18, color: "FFFFFF" })],
            }),
          ],
          shading: { fill: accentHex },
          width: { size: 1800, type: WidthType.DXA },
          borders: medBorders,
        }),
    ),
  });

  const medRows =
    rx.medications.length > 0
      ? rx.medications.map(
          (med, idx) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: med.name, size: 17 })] }),
                  ],
                  width: { size: 1800, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? "FEF9E7" : "FFFFFF" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: med.dose, size: 17 })] }),
                  ],
                  width: { size: 1400, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? "FEF9E7" : "FFFFFF" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: med.route, size: 17 })] }),
                  ],
                  width: { size: 1100, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? "FEF9E7" : "FFFFFF" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: med.frequency, size: 17 })] }),
                  ],
                  width: { size: 1600, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? "FEF9E7" : "FFFFFF" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: med.duration, size: 17 })] }),
                  ],
                  width: { size: 1400, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? "FEF9E7" : "FFFFFF" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: `${med.caution}. ${med.monitoring}`, size: 16 }),
                      ],
                    }),
                  ],
                  width: { size: 2500, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? "FEF9E7" : "FFFFFF" },
                }),
              ],
            }),
        )
      : [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "No medications prescribed in this plan.",
                        size: 18,
                        italics: true,
                      }),
                    ],
                  }),
                ],
                columnSpan: 6,
              }),
            ],
          }),
        ];

  // Investigations list
  const investigationParas =
    rx.investigations.length > 0
      ? rx.investigations.map(
          (inv) =>
            new Paragraph({
              children: [
                new TextRun({ text: `• ${inv.test} — ${inv.reason} (${inv.when})`, size: 20 }),
              ],
              spacing: { after: 6 },
            }),
        )
      : [
          new Paragraph({
            children: [
              new TextRun({
                text: "• No additional investigations recommended at this time.",
                size: 20,
                italics: true,
              }),
            ],
          }),
        ];

  // Non-pharmacological
  const nonPharmParas =
    rx.non_pharmacological.length > 0
      ? rx.non_pharmacological.map(
          (item) =>
            new Paragraph({
              children: [new TextRun({ text: `• ${item}`, size: 20 })],
              spacing: { after: 5 },
            }),
        )
      : [
          new Paragraph({
            children: [
              new TextRun({
                text: "• Continue current lifestyle measures.",
                size: 20,
                italics: true,
              }),
            ],
          }),
        ];

  // Patient education
  const educationParas =
    rx.patient_education.length > 0
      ? rx.patient_education.map(
          (item) =>
            new Paragraph({
              children: [new TextRun({ text: `• ${item}`, size: 20 })],
              spacing: { after: 5 },
            }),
        )
      : [
          new Paragraph({
            children: [
              new TextRun({
                text: "• Standard pain medicine self-management education provided.",
                size: 20,
                italics: true,
              }),
            ],
          }),
        ];

  // Warning signs (red)
  const warningParas =
    rx.warning_signs.length > 0
      ? rx.warning_signs.map(
          (item) =>
            new Paragraph({
              children: [new TextRun({ text: `⚠ ${item}`, size: 20, color: "DC2626", bold: true })],
              spacing: { after: 5 },
            }),
        )
      : [
          new Paragraph({
            children: [
              new TextRun({
                text: "• Seek immediate care for severe hypoglycemia, DKA symptoms, or chest pain.",
                size: 20,
                color: "DC2626",
              }),
            ],
          }),
        ];

  const sectionHeading = (text: string, color = accentHex, spacingBefore?: number) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 24, color })],
      spacing: { before: spacingBefore, after: 120 },
    });

  const bodyChildren = [
    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: appName, bold: true, size: 48, color: accentHex })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "AI-Assisted Pain Medicine Prescription & Management Plan",
          size: 24,
          color: "6B5B3F",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `Date: ${today}  |  Specialty: ${specialtyLabel}`,
          size: 20,
          color: "666666",
        }),
      ],
    }),

    // Patient Information
    sectionHeading("PATIENT INFORMATION"),
    new Table({ width: { size: 9800, type: WidthType.DXA }, rows: patientRows }),

    // Diagnosis
    sectionHeading("DIAGNOSIS", accentHex, 400),
    new Paragraph({
      children: [
        new TextRun({ text: "Primary: ", bold: true, size: 22 }),
        new TextRun({ text: rx.primary_diagnosis, size: 22, bold: true }),
      ],
      spacing: { after: 80 },
    }),
    ...(rx.secondary_diagnoses.length > 0
      ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Secondary: ", bold: true, size: 20 }),
              new TextRun({ text: rx.secondary_diagnoses.join(" • "), size: 20 }),
            ],
            spacing: { after: 80 },
          }),
        ]
      : []),
    new Paragraph({
      children: [
        new TextRun({ text: "Urgency: ", bold: true, size: 20 }),
        new TextRun({
          text: rx.urgency.toUpperCase(),
          size: 20,
          bold: true,
          color:
            rx.urgency === "Routine" ? "16A34A" : rx.urgency === "Urgent" ? "D97706" : "DC2626",
        }),
      ],
      spacing: { after: 200 },
    }),

    // Clinical Summary
    sectionHeading("CLINICAL SUMMARY"),
    new Paragraph({
      children: [new TextRun({ text: rx.clinical_summary, size: 21 })],
      spacing: { after: 200 },
    }),

    // Specialty Assessment
    sectionHeading("SPECIALTY ASSESSMENT"),
    new Paragraph({
      children: [new TextRun({ text: rx.specialty_assessment, size: 21 })],
      spacing: { after: 300 },
    }),

    // Medications
    sectionHeading("MEDICATIONS"),
    new Table({ width: { size: 9800, type: WidthType.DXA }, rows: [medHeaderRow, ...medRows] }),

    // Investigations
    sectionHeading("INVESTIGATIONS", accentHex, 350),
    ...investigationParas,

    // Non-pharmacological
    sectionHeading("NON-PHARMACOLOGICAL RECOMMENDATIONS", accentHex, 250),
    ...nonPharmParas,

    // Patient Education
    sectionHeading("PATIENT EDUCATION", accentHex, 250),
    ...educationParas,

    // Warning Signs
    sectionHeading("WARNING SIGNS — REPORT IMMEDIATELY", "DC2626", 250),
    ...warningParas,

    // Follow-up
    sectionHeading("FOLLOW-UP", accentHex, 300),
    new Paragraph({
      children: [
        new TextRun({
          text: `Review in ${rx.follow_up_weeks} weeks. ${rx.follow_up_advice}`,
          size: 21,
        }),
      ],
      spacing: { after: 120 },
    }),
    ...(rx.referral
      ? [
          new Paragraph({
            children: [new TextRun({ text: `Referral: ${rx.referral}`, size: 21 })],
            spacing: { after: 200 },
          }),
        ]
      : []),

    // Pain Medicine-specific targets
    ...(rx.hba1c_target || rx.dose_titration_plan || rx.sick_day_rules
      ? [sectionHeading("DIABETES-SPECIFIC TARGETS & RULES", accentHex, 200)]
      : []),
    ...(rx.hba1c_target
      ? [
          new Paragraph({
            children: [new TextRun({ text: `HbA1c Target: ${rx.hba1c_target}`, size: 21 })],
            spacing: { after: 60 },
          }),
        ]
      : []),
    ...(rx.dose_titration_plan
      ? [
          new Paragraph({
            children: [
              new TextRun({ text: `Dose Titration Plan: ${rx.dose_titration_plan}`, size: 21 }),
            ],
            spacing: { after: 60 },
          }),
        ]
      : []),
    ...(rx.sick_day_rules
      ? [
          new Paragraph({
            children: [new TextRun({ text: `Sick Day Rules: ${rx.sick_day_rules}`, size: 21 })],
            spacing: { after: 200 },
          }),
        ]
      : []),

    // Disclaimer
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text:
            rx.disclaimer ||
            "This is an AI-assisted draft prescription. All clinical decisions and final prescriptions remain the sole responsibility of the treating physician. Always verify with current guidelines and patient-specific factors.",
          size: 17,
          italics: true,
          color: "777777",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100 },
      children: [
        new TextRun({ text: `Generated by ${appName} • ${today}`, size: 16, color: "999999" }),
      ],
    }),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 }, // A4
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${appName} • AI Pain Medicine Prescription`,
                    bold: true,
                    size: 18,
                    color: accentHex,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Confidential • For clinical use only • Generated on ",
                    size: 16,
                    color: "888888",
                  }),
                  new TextRun({ text: today, size: 16, color: "888888" }),
                ],
              }),
            ],
          }),
        },
        children: bodyChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `PainAI_${input.name?.replace(/\s+/g, "_") || "Patient"}_${new Date().toISOString().slice(0, 10)}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
