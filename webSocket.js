import { WebSocketServer } from 'ws';
import { sendMessage } from './controllers/chatController.js';

let clients = {}; // { roomId1: [ws1, ws2], roomId2: [ws3] }

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    ws.send(JSON.stringify({ success: true, message: 'Connected to server!' }));

    ws.on('message', async (raw) => {
      try {
        const { roomId, userId, message } = JSON.parse(raw);
        // Save message in DB
        const result = await sendMessage(roomId, userId, message);

        // Add ws to room
        if (!clients[roomId]) clients[roomId] = [];
        if (!clients[roomId].includes(ws)) clients[roomId].push(ws);

        // Broadcast message to all clients in the room
        clients[roomId].forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(result));
          }
        });
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });

    ws.on('close', () => {
      // Remove ws from all rooms
      for (const roomId in clients) {
        clients[roomId] = clients[roomId].filter((c) => c !== ws);
      }
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server initialized');
}
