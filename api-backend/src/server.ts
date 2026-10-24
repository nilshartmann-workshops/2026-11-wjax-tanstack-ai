import express from "express";

import restApi from "./rest-api.ts";

/**
 * Der API-Server von hütly. In einer Java-Anwendung stünde an dieser Stelle
 * Spring Boot: Der Assistent spricht ihn nur über HTTP an.
 */
const app = express();

app.use(express.json());
app.use("/api", restApi);

// Alle Ports dieses Projekts liegen im 26er-Block: Frontend 26000, API-Server
// 26080, Chat-Server 26081.
const port = 26080;

app.listen(port, () => {
  console.log(`hütly API-Server läuft auf http://localhost:${port}`);
});
