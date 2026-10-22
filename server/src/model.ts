import { anthropicText } from "@tanstack/ai-anthropic";
import { createOllamaChat } from "@tanstack/ai-ollama";

/// Das Modell, mit dem der Assistent spricht.
///
/// Ohne Angabe ist das Gemma über ein lokales Ollama, kein Konto, kein
/// Schlüssel, kein Netz. Mit `HUETLY_MODEL=anthropic` spricht derselbe Code
/// mit Claude und liest den Schlüssel aus `ANTHROPIC_API_KEY`. Der Adapter ist
/// die einzige Stelle, die den Anbieter kennt.
export const chatAdapter =
  process.env.HUETLY_MODEL === "anthropic"
    ? anthropicText("claude-sonnet-5-5")
    : createOllamaChat(
        "gemma4:31b-mlx",
        process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
      );
