import dotenv from "dotenv";
import express from "express";
import http from "http";  
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locations.js";
import { verifySocketToken } from "./utils/jwt.js";
import Location from "./models/Location.js";
 
dotenv.config();
const app = express();
const server = http.createServer(app);
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
app.use(express.static(path.join(__dirname, "public")));
 
 
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
 

 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });

 
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || "*", credentials: true },
});

 
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("No auth token"));
    const payload = verifySocketToken(token);
    socket.user = { id: payload.id, name: payload.name,email: payload.email };
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id, "user:", socket.user?.id);
 
  socket.on("sendlocation", async (data) => {
    try {
      const { latitude, longitude, speed, heading } = data || {};
      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return;  
      }

    
      await Location.create({
        userId: socket.user.id,
        latitude,
        longitude,
        speed: typeof speed === "number" ? speed : undefined,
        heading: typeof heading === "number" ? heading : undefined,
      });

     
  io.emit("recievelocation", {
  id: socket.id,
  userId: socket.user.id,
  name: socket.user.name,      
  email: socket.user.email,  
  latitude,
  longitude,
  speed,
  heading,
  timestamp: Date.now(),
});


    } catch (e) {
      console.error("sendlocation error:", e.message);
    }
  });

  socket.on("disconnect", () => {
    io.emit("userdisconnected", socket.user?.id || socket.id);
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

 
app.get("/health", (req, res) => res.json({ status: "ok" }));

 
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));
