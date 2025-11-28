import { GoogleGenAI, Type } from "@google/genai";
import { ClientFormData } from "../types";

// Initialize Gemini
// Note: In a production environment, never expose keys on the client side.
// This is strictly based on the prompt instructions to use process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseClientText = async (text: string): Promise<Partial<ClientFormData>> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Extraia as informações do cliente do seguinte texto e formate como JSON.
      Se algum campo não for encontrado, retorne uma string vazia "".
      
      Texto para analisar:
      "${text}"
      
      Regras para Status:
      - Se mencionar "já foi", "retirado", "ok": status = "Retirado"
      - Se tiver data/hora futura ou "agendado": status = "Agendado"
      - Caso contrário: status = "Fazer"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            phone: { type: Type.STRING },
            address: { type: Type.STRING },
            vehicle: { type: Type.STRING },
            plate: { type: Type.STRING },
            trackerNumber: { type: Type.STRING },
            observations: { type: Type.STRING },
            scheduledDate: { type: Type.STRING, description: "Format YYYY-MM-DD if found" },
            scheduledTime: { type: Type.STRING, description: "Format HH:mm if found" },
            status: { type: Type.STRING, enum: ["Fazer", "Agendado", "Retirado"] }
          },
          required: ["name", "status"]
        }
      }
    });

    const result = response.text;
    if (!result) throw new Error("No response from AI");

    const parsed = JSON.parse(result);
    return parsed as Partial<ClientFormData>;

  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw error;
  }
};