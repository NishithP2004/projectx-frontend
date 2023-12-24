const express = require("express");
require("dotenv").config({
  path: "../.env",
});
const {
  instrument
} = require("@socket.io/admin-ui");
const http = require("http");
const admin = require("firebase-admin");
const cors = require("cors");
const multer = require("multer");
const path = require('path')

const upload = multer({
  limits: 50, // 50mb
});

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static("public/dist"))

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: ["https://admin.socket.io"],
  credentials: true,
});

instrument(io, {
  mode: "development",
  auth: false,
});

server.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}`);
});

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses/list", async (req, res) => {
  try {
    let data = await fetch(
        "https://projectx-backend.azurewebsites.net/api/courses/list", {
          headers: {
            Authorization: req.headers.authorization,
          },
          method: "GET",
        },
      )
      .then((r) => r.json())
      .catch((err) => {
        console.log(err);
        res.json({
          success: false,
          error: err.message,
        });
      });

    console.log(data);
    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.post("/api/courses/create", upload.single("file"), async (req, res) => {
  try {
    let formData = new FormData();
    formData.append("course_name", req.body.course_name);
    console.log(req.file);
    const blob = new Blob([req.file.buffer]);
    formData.append("file", blob, req.file.originalname);

    let data = await fetch(
        "https://projectx-backend.azurewebsites.net/api/courses/create", {
          headers: {
            Authorization: req.headers.authorization
          },
          body: formData,
          method: "POST",
        },
      )
      .then((r) => r.json())
      .catch((err) => {
        console.log(err);
        res.json({
          success: false,
          error: err.message,
        });
      });

    console.log(data);
    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.get("/api/courses/documents/:id", async (req, res) => {
  try {
    let data = await fetch(
        `https://projectx-backend.azurewebsites.net/api/courses/documents/${req.params.id}`, {
          headers: {
            Authorization: req.headers.authorization
          },
          method: "GET"
        }
      )
      .then((r) => r.json())
      .catch((err) => {
        console.log(err);
        res.json({
          success: false,
          error: err.message,
        });
      });

    console.log(data);
    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("public", "dist", "index.html"))
})

io.on("connection", (client) => {
  console.log(`Connected to ${client.id}`);
  client.on('message', (data, callback) => {
    console.log(data)
    callback({
      msg: "Hello World",
      from: 'AI'
    })
  })
});