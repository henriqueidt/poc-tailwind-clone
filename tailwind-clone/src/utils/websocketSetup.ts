import WebSocket, { Server } from "ws";

// Create a WebSocket server
const wss: Server = new WebSocket.Server({ noServer: true });

// Store the connected WebSocket clients
const clients: Set<WebSocket> = new Set();

// Broadcast a message to all connected clients
function broadcast(message: string): void {
  clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Handle WebSocket connection
wss.on("connection", (ws: WebSocket) => {
  clients.add(ws);

  // Handle WebSocket close event
  ws.on("close", () => {
    clients.delete(ws);
  });
});

export { wss, broadcast };
