import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { setupWebSocket } from './webSocket.js';

import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
const Port = process.env.MAIN_PORT || 3000;


// Middlewares for Parsing data to json data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for static files accessing
app.use(express.static("public"));

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to Homepage");
})


// Route handling middlewares 
app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);
// app.use("/chats", chatRoutes);

// Error handling middlewares 
// 404 handler 
app.use((err, req, res, next) => {
    res.status(404).json({ success: false, error: true, message: "Endpoint not found" });
});
// global error handler 
app.use((err, req, res, next) => {
    console.log("Some Internal occured-from global error handler middleware");
    res.status(500).json({ success: false, error: true, message: "Internal server error" });
});

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
setupWebSocket(server);


server.listen(Port, (err) => {
    if (err) {
        console.log("Error while creating Server");
    } else {
        console.log(`Server is running at http://localhost:${Port}`)
    }
})

