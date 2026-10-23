import { createAnthropicChat } from "@tanstack/ai-anthropic";
import { createOllamaChat } from "@tanstack/ai-ollama";
import { fakeText, type FakeResponseStep } from "@tanstack/ai/testing";

import { answerFromScript } from "./fake-script.ts";

/**
 * Das Modell, mit dem der Assistent spricht. Gewählt wird es beim Start des
 * Chat-Servers mit `HUETLY_MODEL`, Groß- und Kleinschreibung egal:
 *
 * - `sonnet` (Standard): Claude Sonnet 5.5, braucht `HUETLY_ANTHROPIC_API_KEY`
 * - `haiku`: Claude Haiku 5.5, kleiner und schneller, derselbe Schlüssel
 * - `gemma`: Gemma über ein lokales Ollama, kein Konto, kein Netz
 *
 * Der Adapter ist die einzige Stelle, die den Anbieter kennt.
 */
export const modelName = (process.env.HUETLY_MODEL ?? "sonnet").toLowerCase();

export const chatAdapter = createChatAdapter();

function createChatAdapter() {
  switch (modelName) {
    case "sonnet":
      return createAnthropicChat("claude-sonnet-5-5", anthropicApiKey());
    case "haiku":
      return createAnthropicChat("claude-haiku-5-5", anthropicApiKey());
    case "gemma":
      return createOllamaChat(
        "gemma4:31b-mlx",
        process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
      );
    case "fake":
      return createFakeModel();
  }
  throw new Error(
    `HUETLY_MODEL=${modelName} gibt es nicht. Erlaubt sind sonnet, haiku und gemma.`,
  );
}

// 🕵️‍♂️ Erzählen: ein Modell nach Drehbuch, ohne Netz und ohne Schlüssel
function createFakeModel() {
  const model = fakeText({ tokensPerSecond: 30 });
  // 🕵️‍♂️ Fallstrick: jede Antwort verbraucht einen Eintrag der Warteschlange, deshalb stellt sich das Drehbuch wieder an
  const answer: FakeResponseStep = ({ request }) => {
    model.appendResponses([answer]);
    return answerFromScript(request.messages);
  };
  model.setResponses([answer]);
  return model;
}

/**
 * Der Schlüssel heißt nicht `ANTHROPIC_API_KEY`, damit andere Werkzeuge auf
 * demselben Rechner ihn nicht versehentlich mitbenutzen.
 */
function anthropicApiKey() {
  const apiKey = process.env.HUETLY_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      `HUETLY_MODEL=${modelName} braucht HUETLY_ANTHROPIC_API_KEY. Ohne Schlüssel geht es mit HUETLY_MODEL=gemma.`,
    );
  }
  return apiKey;
}
