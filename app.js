const express = require("express");
const app = express();
const http = require("http").createServer(app);
require("dotenv").config();
const socketIo = require("socket.io")(http, {
  cors: {
    origin: process.env.VITE_PUBLIC_HOST,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const markers = {};

http.listen(4000, () => {
  socketIo.on("connection", (socket) => {
    console.log("connection", socket.id, 23);
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
});
