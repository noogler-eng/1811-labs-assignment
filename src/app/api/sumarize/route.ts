import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.DEEPSEEK_API_KEY });

export async function POST(req: any) {
  const { content } = await req.json();

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });

  return Response.json({ summary: response.text });
}
