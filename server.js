const express = require("express");
const path = require("path");
const fsPromise = require("fs").promises;
const uuid = require("./helpers/uuid");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", async (req, res) => {
  const data = await fsPromise.readFile("./db/db.json", "utf8");
  res.json(JSON.parse(data));
});

app.post("/api/notes", async (req, res) => {
  try {
    const data = await fsPromise.readFile("./db/db.json", "utf8");
    const notes = JSON.parse(data);
    req.body.id = uuid();
    notes.push(req.body);
    await fsPromise.writeFile("./db/db.json", JSON.stringify(notes));
    res.json(req.body);
  } catch (err) {
    res.json(err);
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const data = await fsPromise.readFile("./db/db.json", "utf8");
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== req.params.id);
    await fsPromise.writeFile("./db/db.json", JSON.stringify(filteredNotes));
    res.json(filteredNotes);
  } catch (err) {
    res.json(err);
  }
});

app.listen(3000, () => {
  console.log(`listening at http://localhost:3000`);
});
