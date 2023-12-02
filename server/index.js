const express = require('express');
require('dotenv').config({
    path: '../.env'
})
const { instrument } = require('@socket.io/admin-ui');
const http = require('http')
const admin = require('firebase-admin');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: ['https://admin.socket.io'],
    credentials: true
})

instrument(io, {
    mode: 'development',
    auth: false
})

server.listen(PORT, () => {
    console.log(`Server listening on Port: ${PORT}`)
})

app.get("/api", (req, res) => {
    res.send("Hello World")
})

io.on('connection', client => {
    console.log(`Connected to ${client.id}`);
})
