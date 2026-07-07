import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { createGroqProvider } from "./ai-gateway.server";
import { buildPrompt } from "./prompt";
import type { MedInput, MedPrescription } from "../types";

const TEXT_MODEL = "openai/gpt-oss-120b";
// Vision-capable model, used only when a clinical image is attached so it can
// actually be seen by the model rather than just noted as present in the prompt.
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export const generatePrescription = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as MedInput)
  .handler(async ({ data }): Promise<MedPrescription> => {
    const key = process.env.GROQ_API_KEY;
    if (!key) throw new Error("Missing GROQ_API_KEY");

    const groq = createGroqProvider(key);
    const prompt = buildPrompt(data);
    const hasImage = typeof data.image === "string" && data.image.startsWith("data:image");

    const { text } = await generateText(
      hasImage
        ? {
            model: groq(VISION_MODEL),
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image", image: data.image as string },
                ],
              },
            ],
            temperature: 0.2,
          }
        : {
            model: groq(TEXT_MODEL),
            prompt,
            temperature: 0.2,
          },
    );

    let content = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*$/g, "")
      .trim();
    // Try to extract JSON object if the model added extra text
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      content = content.slice(firstBrace, lastBrace + 1);
    }

    let parsed: MedPrescription;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("AI returned invalid JSON. Please try again.");
    }

    parsed.medications ??= [];
    parsed.non_pharmacological ??= [];
    parsed.investigations ??= [];
    parsed.patient_education ??= [];
    parsed.warning_signs ??= [];
    parsed.secondary_diagnoses ??= [];
    parsed.follow_up_weeks ??= 4;
    parsed.urgency ??= "Routine";
    return parsed;
  });
