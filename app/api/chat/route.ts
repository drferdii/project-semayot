import { createGoogle } from "@ai-sdk/google";
import { streamText } from "ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/semayot/chat-system-prompt";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Layanan chat sedang tidak tersedia." },
      { status: 500 }
    );
  }

  const google = createGoogle({ apiKey });

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: CHAT_SYSTEM_PROMPT,
    messages,
    temperature: 0.7,
    maxOutputTokens: 500,
  });

  return result.toTextStreamResponse();
}
