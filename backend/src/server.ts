import express from "express";

import postApi from "./post-api.ts";

/// Der API-Server von hütly. In einer Java-Anwendung stünde an dieser Stelle
/// Spring Boot: Der Assistent spricht ihn nur über HTTP an.
const app = express();

app.use(express.json());
app.use("/api", postApi);

// Alle Ports dieses Projekts liegen im 63er-Block: Frontend 63000, API-Server
// 63080, Chat-Server 63081.
const port = 63080;

app.listen(port, () => {
  console.log(`hütly API-Server läuft auf http://localhost:${port}`);
});
