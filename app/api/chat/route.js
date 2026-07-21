import { parseJsonRequest, validateRequestBody } from "@/lib/production-guardrails";
import { OpenRouter } from "@openrouter/sdk";

export const runtime = "nodejs";

const MODEL = "cohere/north-mini-code:free";
const SYSTEM_PROMPT =
  "You are a helpful, concise AI assistant powered by Cohere North Mini Code. Answer clearly, write practical code when asked, and format longer answers for easy scanning.";

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        ["system", "user", "assistant"].includes(message?.role) &&
        typeof message?.content === "string" &&
        message.content.trim(),
    )
    .slice(-20)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 8000),
    }));
}

export async function POST(request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response("Missing OPENROUTER_API_KEY in the environment.", {
      status: 500,
    });
  }

  const body = await parseJsonRequest(request);
  const guardrail = validateRequestBody(body);
  if (!guardrail.ok) {
    return Response.json({ error: guardrail.error }, { status: guardrail.status });
  }

  const messages = normalizeMessages(body?.messages);

  if (!messages.some((message) => message.role === "user")) {
    return new Response("Send at least one user message.", { status: 400 });
  }

  const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    httpReferer: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    appTitle: "Suhas Bhairav Cohere Chat",
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await openRouter.chat.send({
          chatRequest: {
            model: MODEL,
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT,
              },
              ...messages.filter((message) => message.role !== "system"),
            ],
            stream: true,
          },
        });

        for await (const chunk of result) {
          const content = chunk.choices?.[0]?.delta?.content;

          if (content) {
            controller.enqueue(encoder.encode(content));
          }

          if (chunk.usage?.reasoningTokens !== undefined) {
            console.log("Cohere reasoning tokens:", chunk.usage.reasoningTokens);
          }
        }
      } catch (error) {
        console.error("Cohere chat error:", error);
        controller.enqueue(
          encoder.encode(
            "OpenRouter could not complete this Cohere request. Please check the server logs and try again.",
          ),
        );
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
