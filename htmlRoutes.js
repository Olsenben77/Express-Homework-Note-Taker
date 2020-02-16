"use strict";

const path = require("path");

//dependencies
const fs = require("fs");
const util = require("util");
const express = require("express");

//setup
const app = express();
const PORT = 3000;

//setup express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes

app.get("/notes", (req, res) => {
  const absolutePath = path.join(__dirname, "notes.html");
  res.sendFile(absolutePath);
});

app.get("*", (req, res) => {
  const absolutePath = path.join(__dirname, "index.html");
  res.sendFile(absolutePath);
});

//Create API routes
app.get("/api/notes", (req, res) => {
  let waitlist;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) throw err;
    notes = data;
    res.json(JSON.parse(notes));
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  let notes;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    {
      fs.writeFile("db.json", JSON.stringify(notes), "utf8", err => {
        if (err) throw "error";
      });
      res.json(true);
      let waiting;
      fs.readFile("db.json", "utf8", (err, data) => {
        if (err) throw err;
        waiting = JSON.parse(data);
        waiting.push(newNote);
        fs.writeFile("db.json", JSON.stringify(waiting), "utf8", err => {
          if (err) throw "error";
        });
      });
      res.json(false);
    }
  });
});

//listener
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
