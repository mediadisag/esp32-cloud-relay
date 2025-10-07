import WebSocket, { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });
console.log("🌐 Cloud WebSocket Relay running on port", PORT);

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("✅ Client connected");
  clients.add(ws);

  ws.on("message", (msg) => {
    console.log("📨 Message:", msg.toString());
    // Broadcast message to all other clients
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients.delete(ws);
  });
});
