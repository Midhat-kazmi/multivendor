const socketIO = require("socket.io");
const express = require("express");
const http = require("https");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "https://multivendor-five.vercel.app", 
  credentials: true,
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));
app.use(express.json());

const io = socketIO(server, {
  cors: corsOptions,
});

app.get("/", (req, res) => {
  res.send("Hello World from secure socket server!");
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  const messages = {};

  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });
    const user = getUser(receiverId);

    if (!messages[receiverId]) messages[receiverId] = [];
    messages[receiverId].push(message);

    io.to(user?.socketId).emit("getMessage", message);
  });

  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);

    if (messages[senderId]) {
      const message = messages[senderId].find(
        (msg) => msg.receiverId === receiverId && msg.id === messageId
      );
      if (message) {
        message.seen = true;
        io.to(user?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          messageId,
        });
      }
    }
  });

  socket.on("updateLastMessage", ({ lastMessage, lastMessageId }) => {
    io.emit("getLastMessage", {
      lastMessage,
      lastMessageId,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on PORT ${process.env.PORT || 4000}`);
});
