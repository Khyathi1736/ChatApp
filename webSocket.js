import { WebSocketServer } from 'ws';
import { sendMessage, fetchMessagesByroomId, removeMessage } from './controllers/chatController.js';
import { joinRoom } from './controllers/roomController.js';

let clients = {}; // { roomId1: [ws1, ws2], roomId2: [ws3] }

export function setupWebSocket(server) {
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        console.log('New WebSocket connection established');
        ws.send(JSON.stringify({ success: true, message: 'Connected to server!' }));

        ws.on('message', async (raw) => {
            try {
                const data = JSON.parse(raw);
                const { action, roomId, userId, message, messageId } = data;

                // ===== Join Room =====
                if (action === 'join') {
                    // Add ws to room
                    if (!clients[roomId]) clients[roomId] = [];
                    if (!clients[roomId].includes(ws)) clients[roomId].push(ws);
                    // Send message history
                    const history = await fetchMessagesByroomId(roomId);
                    ws.send(JSON.stringify({ action: 'history', messages: history.data }));
                    console.log(clients);
                }

                // ===== Send Message =====
                if (action === 'send') {
                    const result = await sendMessage(roomId, userId, message);

                    // Broadcast new message to all clients in the room
                    if (clients[roomId]) {
                        clients[roomId].forEach((client) => {
                            if (client.readyState === ws.OPEN) {
                                client.send(JSON.stringify({ action: 'send', message: result.data }));
                            }
                        });
                    }
                }

                // ===== Delete Message (Soft Delete) =====
                if (action === 'delete') {
                    const result = await removeMessage(messageId, userId);

                    // Broadcast deletion to all clients in the room
                    if (clients[roomId]) {
                        clients[roomId].forEach((client) => {
                            if (client.readyState === ws.OPEN) {
                                client.send(JSON.stringify({ action: 'delete', message: result.data }));
                            }
                        });
                    }
                }

            } catch (err) {
                console.error('WebSocket message error:', err);
                ws.send(JSON.stringify({ success: false, error: true, message: 'Invalid data format' }));
            }
        });
        ws.on('close', () => {
            // Remove ws from room
            for (const roomId in clients) {
                clients[roomId] = clients[roomId].filter((c) => c !== ws);
                if (clients[roomId].length === 0) {
                    delete clients[roomId];
                }
            }
            console.log("Client disconnected");
        });
    });
    console.log('WebSocket server initialized');
}