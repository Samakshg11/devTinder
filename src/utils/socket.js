const socket = require("socket.io");
const Chat = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost", "https://devtinder.site", "http://devtinder.site"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    // Handling joining a specific chat room
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const room = [userId, targetUserId].sort().join("_");
      console.log(userId + " joined room: " + room);
      socket.join(room);
    });

    socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {
      try {
        const room = [userId, targetUserId].sort().join("_");
        console.log("Message from " + firstName + " to room " + room + ": " + text);
        // find or create chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
          });
        }

        chat.messages.push({
          senderId: userId,
          text
        });

        await chat.save();

        io.to(room).emit("messageReceived", { firstName, senderId: userId, text, createdAt: new Date() });
      } catch(err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
