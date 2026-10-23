import assert from "node:assert/strict";
import { test } from "node:test";

import { angeboteSuchenToolDef } from "@huetly/shared/tool-definitions";
import { chat, streamToText } from "@tanstack/ai";
import { fakeText } from "@tanstack/ai/testing";

test("chat() führt die Suche aus und fragt das Modell danach erneut", async () => {
  // 🕵️‍♂️ Erzählen: fakeText ist das Modell, setResponses sein Drehbuch, eine Antwort je Aufruf
  const model = fakeText();
  model.setResponses([
    { toolCalls: [{ name: "angeboteSuchen", input: { tierart: "Katze" } }] },
    { text: "Leider habe ich nichts gefunden." },
  ]);

  // 🕵️‍♂️ Zeigen: dieselbe Definition, im Test ohne Fassade
  let searchedFilter: unknown;
  const angeboteSuchenTool = angeboteSuchenToolDef.server(async (filter) => {
    searchedFilter = filter;
    return [];
  });

  const result = await streamToText(
    chat({
      adapter: model,
      threadId: "test",
      messages: [{ role: "user", content: "Gibt es Katzensitter?" }],
      tools: [angeboteSuchenTool],
    }),
  );

  assert.deepEqual(searchedFilter, { tierart: "Katze" });
  assert.equal(result.text, "Leider habe ich nichts gefunden.");
  assert.equal(model.state.callCount, 2);
});
