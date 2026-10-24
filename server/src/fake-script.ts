import type { ModelMessage } from "@tanstack/ai";
import type { FakeResponse } from "@tanstack/ai/testing";

/**
 * Das Drehbuch für ein Modell ohne Modell. Es liest die letzte Nachricht und
 * entscheidet anhand weniger Stichwörter, was der Assistent antwortet und
 * welches Tool er anfordert. Ausgeführt werden die Tools wie sonst auch von
 * `chat()`, nur die Entscheidung des Modells ist gespielt.
 *
 * Fragen, die das Drehbuch versteht:
 *
 * - „Gibt es Katzensitter in Hamburg im Juli?“ sucht Angebote
 * - „Wer sucht jemanden für Reptilien?“ sucht Gesuche
 * - „Leg ein Gesuch für meine Schildkröten an“ füllt das Formular vor
 * - „Antworte auf das erste“ schlägt eine Antwort vor, mit Freigabe
 * - „Erzähl mir alles über hütly“ antwortet lang, zum Ausprobieren von Stopp
 */
export function answerFromScript(messages: Array<ModelMessage>): FakeResponse {
  const last = messages.at(-1);
  if (last?.role === "tool") {
    return answerToToolResult(messages, last);
  }
  return answerToQuestion(messages, textOf(last).toLowerCase());
}

function answerToQuestion(
  messages: Array<ModelMessage>,
  question: string,
): FakeResponse {
  if (question.includes("antworte")) {
    const eintragId = lastFoundEintragId(messages);
    if (eintragId === undefined) {
      return {
        text: "Auf welchen Eintrag soll ich antworten? Such ihn vorher.",
      };
    }
    return {
      thinking: `Der Nutzer möchte auf ${eintragId} antworten. Ich formuliere einen Vorschlag, veröffentlicht wird erst nach seiner Freigabe.`,
      toolCalls: [
        {
          name: "antwortSenden",
          input: {
            eintragId,
            text: "Hallo! Ich hätte Zeit und Erfahrung damit. Wollen wir uns vorher einmal kennenlernen?",
          },
        },
      ],
    };
  }

  if (
    question.includes("gesuch") &&
    (question.includes("leg") || question.includes("erstell"))
  ) {
    return {
      thinking:
        "Der Nutzer möchte ein Gesuch aufgeben. Ich fülle das Formular vor, veröffentlichen muss er selbst.",
      toolCalls: [
        {
          name: "gesuchVorbereiten",
          input: {
            titel: "Wer kümmert sich um meine Landschildkröten?",
            beschreibung:
              "Meine zwei Landschildkröten brauchen im Juli jemanden, der sie füttert und nach ihnen schaut. Sie sind pflegeleicht und freuen sich über Löwenzahn.",
            tier: "2 Landschildkröten",
            zeitraum: "3 Wochen im Juli",
            ort: "Hamburg-Altona",
            tierart: "Reptil",
          },
        },
      ],
    };
  }

  if (question.includes("erzähl")) {
    return { thinking: "Der Nutzer möchte viel wissen.", text: LONG_TEXT };
  }

  const filter = filterFrom(question);
  if (question.includes("sucht") || question.includes("gesuch")) {
    return {
      thinking:
        "Der Nutzer fragt, wer Betreuung braucht. Das sind Gesuche, also suche ich dort.",
      toolCalls: [{ name: "gesucheSuchen", input: filter }],
    };
  }
  if (Object.keys(filter).length > 0 || question.includes("sitter")) {
    return {
      thinking:
        "Der Nutzer sucht jemanden, der sein Tier betreut. Das sind Angebote, also suche ich dort.",
      toolCalls: [{ name: "angeboteSuchen", input: filter }],
    };
  }

  return {
    text: "Ich bin der Assistent von hütly. Frag mich nach Gesuchen und Angeboten, oder lass mich ein Gesuch für dich vorbereiten.",
  };
}

function answerToToolResult(
  messages: Array<ModelMessage>,
  result: ModelMessage,
): FakeResponse {
  const toolName = messages
    .flatMap((message) => message.toolCalls ?? [])
    .find((call) => call.id === result.toolCallId)?.function.name;
  const output = parse(textOf(result));

  switch (toolName) {
    case "gesucheSuchen":
    case "angeboteSuchen": {
      const found = Array.isArray(output) ? output.length : 0;
      const what = toolName === "angeboteSuchen" ? "Angebot" : "Gesuch";
      if (found === 0) {
        return {
          text: `Dazu habe ich leider kein passendes ${what} gefunden.`,
        };
      }
      return {
        text:
          found === 1
            ? `Ich habe ein passendes ${what} gefunden.`
            : `Ich habe ${found} passende ${what}e gefunden.`,
      };
    }
    case "gesuchVorbereiten":
      return {
        text: "Ich habe das Formular für dich vorbereitet. Prüf es und veröffentliche es selbst.",
      };
    case "antwortSenden":
      return isSent(output)
        ? { text: "Deine Antwort ist gesendet." }
        : { text: "In Ordnung, ich sende nichts." };
  }
  return { text: "Erledigt." };
}

const TIERARTEN: Record<string, string> = {
  katze: "Katze",
  hund: "Hund",
  reptil: "Reptil",
  schildkröte: "Reptil",
  pflanze: "Pflanze",
  kaktus: "Pflanze",
};

const CITIES = ["Hamburg", "Berlin", "München", "Köln", "Bremen", "Frankfurt"];

const MONTHS = ["Mai", "Juni", "Juli", "August", "September"];

function filterFrom(question: string) {
  const filter: Record<string, string> = {};
  const tierart = Object.entries(TIERARTEN).find(([word]) =>
    question.includes(word),
  );
  if (tierart) {
    filter.tierart = tierart[1];
  }
  const city = CITIES.find((name) => question.includes(name.toLowerCase()));
  if (city) {
    filter.ort = city;
  }
  const month = MONTHS.find((name) => question.includes(name.toLowerCase()));
  if (month) {
    filter.zeitraum = month;
  }
  return filter;
}

function lastFoundEintragId(messages: Array<ModelMessage>) {
  for (const message of messages.toReversed()) {
    const output = message.role === "tool" ? parse(textOf(message)) : null;
    if (Array.isArray(output) && output.length > 0) {
      return String(output[0].id);
    }
  }
  return undefined;
}

function isSent(output: unknown) {
  return typeof output === "object" && output !== null && "antwortId" in output;
}

function textOf(message: ModelMessage | undefined) {
  if (message === undefined || message.content === null) {
    return "";
  }
  if (typeof message.content === "string") {
    return message.content;
  }
  return message.content
    .map((part) => (part.type === "text" ? part.content : ""))
    .join("");
}

function parse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const LONG_TEXT = `
hütly bringt Menschen zusammen, die verreisen, und Menschen, die sich in der Zeit um Tiere und Pflanzen kümmern.

Auf der Pinnwand der Gesuche schreibt, wer Betreuung braucht: für die Katze, den Hund, die Schildkröten oder den Kaktus. Auf der Pinnwand der Angebote schreibt, wer Zeit hat und helfen möchte.

Unter jedem Eintrag kann man antworten. So findet man sich, spricht sich ab und lernt sich am besten vorher einmal kennen.

Die Betreuung selbst ist meist unkompliziert. Füttern, Wasser wechseln, ein bisschen Gesellschaft. Manche Tiere brauchen mehr: Hunde wollen raus, Reptilien brauchen Wärme, und manche Katzen erwarten eine tägliche Audienz.

Pflanzen sind genügsamer, aber auch sie haben ihre Eigenheiten. Ein Kaktus will kaum Wasser, eine Monstera dagegen regelmäßig, und Zimmerpflanzen-WGs wollen am liebsten alle gleichzeitig versorgt werden.
`.trim();
