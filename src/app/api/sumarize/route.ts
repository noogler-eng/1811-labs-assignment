import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.DEEPSEEK_API_KEY });

export async function POST(req: any) {
  const { content } = await req.json();

  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "You are an AI that summarizes notes. Provide only the summary of the following content in **well-structured format**, suitable for displaying directly on a screen. Do not include any extra commentary, disclaimers, or asterisks.",
          },
        ],
      },
    ],
  });

  const response = await chat.sendMessage({
    message: content,
  });

  return Response.json({ summary: response.text });
}
