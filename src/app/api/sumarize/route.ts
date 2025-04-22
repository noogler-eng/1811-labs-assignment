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
            text: "you are notes summarize ai which gives only summary of the content, give me response in proper format so that we can display on screen like you can give it in markdown",
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
