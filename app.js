const express = require("express");
const app = express();
require("dotenv").config();
const socketIo = require("socket.io");

const markers = {};
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server Listening at PORT - ${PORT}`);
});

const io = new socketIo.Server(server, {
  cors: {
    origin: process.env.VITE_PUBLIC_HOST,
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    socket.emit("user-disconnect", socket.id);
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
});
