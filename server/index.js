const express = require("express");
require("dotenv").config();
const {
  instrument
} = require("@socket.io/admin-ui");
const http = require("http");
const morgan = require('morgan')
const admin = require("firebase-admin");
const path = require('path')
var serviceAccount = require("./project-x-92081-6c41507a6aa7.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const BASE_URL = process.env.BASE_URL
const cors = require("cors");
const multer = require("multer");
const generate_response = require('./chat.js')

const upload = multer({
  limits: 50, // 50mb
});

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(morgan(":method :url :status - :remote-addr"));
// app.use(cors())
// app.use(express.static("public/dist"))

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: ["https://admin.socket.io"],
  credentials: true,
  maxHttpBufferSize: 1e8
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
        `${BASE_URL}/api/courses/list`, {
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
        `${BASE_URL}/api/courses/create`, {
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

    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.delete("/api/courses/:id", async (req, res) => {
  try {
    let data = await fetch(
        `${BASE_URL}/api/courses/${req.params.id}`, {
          headers: {
            Authorization: req.headers.authorization
          },
          method: "DELETE",
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
        `${BASE_URL}/api/courses/documents/${req.params.id}`, {
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

    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.post("/api/search-queries", async (req, res) => {
  const content = req.body.content
  console.log(content)
  try {
    let data = await fetch(
        `${BASE_URL}/api/search-queries`, {
          method: "POST",
          headers: {
            Authorization: req.headers.authorization
          },
          body: JSON.stringify({
            content: content
          })
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
    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.post("/api/quiz", async (req, res) => {
  const transcript = req.body.transcript

  try {
    let data = await fetch(
        `${BASE_URL}/api/quiz`, {
          method: "POST",
          headers: {
            Authorization: req.headers.authorization
          },
          body: JSON.stringify({
            transcript: transcript
          })
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
    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    let data = await fetch(
        `${BASE_URL}/api/search?q=${req.query.q}&type=${req.query.type? req.query.type : "google"}`, {
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

    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.get("/api/reels", async (req, res) => {
  try {
    let data = await fetch(
        `${BASE_URL}/api/reels?q=${req.query.q}`, {
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

    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.get("/api/browser", async (req, res) => {
  try {
    let data = await fetch(
        `${BASE_URL}/api/browser?${Boolean(req.query.aiEnhanced)? "aiEnhanced=" + req.query.aiEnhanced + "&": ""}url=${req.query.url}`, {
          headers: {
            Authorization: req.headers.authorization
          },
          method: "GET"
        }
      )
      .then((r) => r.text())
      .catch((err) => {
        console.log(err);
        res.send(data);
      });

    res.send(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve("public", "dist", "index.html"))
// })

// Socket IO
io.on("connection", (client) => {
  console.log(`Connected to ${client.id}`);

  client.on('message', async (data, callback) => {
    try {
      let res = "";
      if (!data.token)
        res = "401 Unauthorized";
      else {
        let user = await admin.auth().verifyIdToken(data.token)
          .catch(err => {
            if (err) {
              res = "403 Forbidden";
              callback({
                msg: res,
                from: 'AI'
              });
            }
          });
        if (user.uid) {
          res = await generate_response(data.data.msg, (data.data.queryMultipleDocs === true? undefined: data.data.course), user.uid, data.data.context);
          console.log("AI Response: " + res);
        }
      }
      callback({
        msg: res,
        from: 'AI'
      });
    } catch (err) {
      callback({
        msg: err.message,
        from: "AI"
      })
    }
  });

  client.on('message-java', async (data) => {
    try {
      let res = "";
      if (!data.token)
        res = "401 Unauthorized";
      else {
        console.log(data)
        let user = await admin.auth().verifyIdToken(data.token)
          .catch(err => {
            if (err) {
              res = "403 Forbidden";
              io.to(client.id).emit("reply-java", res);
            }
          });
        if (user.uid) {
          res = await generate_response(data.data.msg, (data.data.queryMultipleDocs === true? undefined: data.data.course), user.uid, data.data.context);
          console.log("AI Response: " + res);
        }
      }
      console.log(res)
      io.to(client.id).emit("reply-java", res);
    } catch (err) {
      console.log(err.message)
      io.to(client.id).emit("reply-java", err.message)
    }
  });
});