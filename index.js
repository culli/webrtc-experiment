const os = require("os");
const express = require("express");
const socketIO = require("socket.io");

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log("listening on " + port);
});

const io = socketIO(server);

io.sockets.on("connection", (socket) => {
  const log = (...arguments) => {
    console.log(arguments);
    const array = ["Message from server:"];
    array.push.apply(array, arguments);
    socket.emit("log", array);
  };

  socket.on("message", (message, room) => {
    log("Client said: ", message);
    socket.in(room).emit("message", message, room);
  });

  socket.on("create or join", (room) => {
    log(`Received request to create or join room ${room}`);
    console.log({"io.sockets.adapter.rooms": io.sockets.adapter.rooms});
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    console.log({clientsInRoom});
    const numClients = clientsInRoom
      ? clientsInRoom.size
      : 0;
    log(`Room ${room} now has ${numClients} client(s)`);
    if (numClients === 0) {
      socket.join(room);
      log(`Client ID ${socket.id} created room ${room}`);
      socket.emit("created", room, socket.id);
    } else if (numClients === 1) {
      log(`Client ID ${socket.id} joined room ${room}`);
      io.sockets.in(room).emit("join", room);
      socket.join(room);
      socket.emit("joined", room, socket.id);
      io.sockets.in(room).emit("ready");
    } else {
      socket.emit("full", room);
    }
  });

  socket.on("ipaddr", () => {
    const ifaces = os.networkInterfaces();
    for (const dev in ifaces) {
      ifaces[dev].forEach((details) => {
        if (details.family === "IPv4" && details.address !== "127.0.0.1") {
          socket.emit("ipaddr", details.address);
        }
      });
    }
  });

  socket.on("bye", () => {
    console.log("received bye");
  });
});
