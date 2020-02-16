"use strict";

const path = require("path");

//dependencies
const fs = require("fs");
const util = require("util");
const express = require("express");
const userNote = require("./notes").userNote;
const uuid = require("node-uuid");
const httpContext = require("express-http-context");

//setup
const app = express();
const PORT = 3000;

//setup express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(httpContext.middleware);

//Assign unique identifier for each request
app.use(function(req, res, next) {
  httpContext.set("reqId", uuid.v1());
  next();
});

// Access query parameter

let userNote = req.query.userNote;
let id = await userNote
  .findAll()
  .paginate({ userNote: userNote })
  .exec();

//Return ids
res.render("index", {
  id: id
});

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
app.delete("/api/notes:id", (req, res) => {
  res.send("Note Deleted");
});

//listener
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
