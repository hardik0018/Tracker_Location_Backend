const express = require("express");
const app = express();
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const server = createServer(app);
const io = new Server(server, {
  transports: ["websocket"]
});

app.use(express.json());
app.use(cors());
const markers = {};

io.on("connection", (socket) => {
  console.log("connection", socket.id, 23);
  socket.on("disconnect", () => {
    io.emit("user-disconnect", socket.id);
  });

  socket.on("user-disconnect", (id) => {
    if (markers[id]) {
      delete markers[id];
    }
  });

  socket.on("send-location", (data) => {
    const { latitude, longitude } = data;
    if (!markers[socket.id]) {
      markers[socket.id] = { latitude, longitude };
    }
    socket.emit("All-location", markers);
  });

  socket.on("connect_error", (err) => {
   console.log(err)
  });
});

app.get("/", (req, res) => {
  res.send({ markers });
});

server.listen(4000);
