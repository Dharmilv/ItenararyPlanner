const express = require("express");
const mongoose = require("mongoose");
const axios = require('axios');
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const tripRoutes = require('./routes/tripRoutes');
const submissionRoutes = require('./routes/submissionRoutes');


const app = express();
app.use(express.json());

// ✅ CORS Setup
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected..."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

  const User = require("./models/User"); // adjust path if needed

  app.post("/api/validate-user", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ valid: false, message: "User not found" });
  
      res.json({ valid: true, name: user.name });
    } catch (err) {
      res.status(500).json({ valid: false, message: "Server error" });
    }
  });
  
  
// ✅ API Routes
app.use("/", authRoutes);

app.get("/sample", (req, res) => {
  res.send({ message: "msg" });
});

app.use('/api/trip', tripRoutes);

app.use('/api', submissionRoutes);


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
  windowMs: 60 * 10000, // 10 minute
  max: 2, // Max 2 requests per user/IP per minute
  message: "Too many requests. Please try again later.",
});

app.post('/api/chat', chatLimiter, async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: userMessage }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(botReply);

    res.json({ reply: botReply || "No reply generated." });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Gemini API failed",
      details: error.response?.data || error.message,
    });
  }
});


const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://itenaryplanner.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("✅ New client connected");

  socket.on("join-room", ({ email, teamCode }) => {
    console.log(`${email} is joining ${teamCode}`);
    socket.join(teamCode);

    io.to(teamCode).emit("message", {
      sender: "System",
      text: `${email} joined the chat.`,
    });
  });

  socket.on("chat-message", ({ room, sender, text }) => {
    io.to(room).emit("message", { sender, text });
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

// ✅ Replace this line:
// app.listen(PORT, () => console.log(...))
// 🔁 With this:
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

