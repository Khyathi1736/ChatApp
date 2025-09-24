import express from 'express';
import { createNewRoom, joinRoom, closeRoom, fetchRoomById } from '../controllers/roomController.js';

const roomRouter = express.Router();

// Create a new room
roomRouter.post('/create-room', async (req, res) => {
    try {
        const { roomId, password, createdBy } = req.body;
        const result = await createNewRoom(roomId, password, createdBy);

        if (!result.success) return res.status(400).json(result);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating room:', err);
        res.status(500).json({
            success: false,
            error: true,
            message: "Internal error while creating room",
            data: null
        });
    }
});

// Join a room
roomRouter.post('/join-room', async (req, res) => {
    try {
        const { roomId, password } = req.body;
        const result = await joinRoom(roomId, password);

        if (!result.success) return res.status(401).json(result);
        res.json(result);
    } catch (err) {
        console.error('Error joining room:', err);
        res.status(500).json({
            success: false,
            error: true,
            message: "Internal error while joining room",
            data: null
        });
    }
});

// Get room details by roomId
roomRouter.get('/get-room/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const result = await fetchRoomById(String(roomId));

        if (!result.success) return res.status(404).json(result);
        res.json(result);
    } catch (err) {
        console.error('Error fetching room by id:', err);
        res.status(500).json({
            success: false,
            error: true,
            message: "Internal error while fetching room by id",
            data: null
        });
    }
});


// Close a room
roomRouter.post('/close-room', async (req, res) => {
    try {
        const { roomId } = req.body;
        const result = await closeRoom(roomId);

        if (!result.success) return res.status(400).json(result);
        res.json(result);
    } catch (err) {
        console.error('Error closing room:', err);
        res.status(500).json({
            success: false,
            error: true,
            message: "Internal error while closing room",
            data: null
        });
    }
});

export default roomRouter;
