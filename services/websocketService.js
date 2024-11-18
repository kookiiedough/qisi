const WebSocket = require('ws');

let wss;

function initialize(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
      console.log('Received:', message);
      // Handle incoming messages here
      try {
        const data = JSON.parse(message);
        // Assuming a function to process the received data exists
        processReceivedData(data);
      } catch (error) {
        console.error('Error processing received message:', error.message, error.stack);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error.message, error.stack);
    });
  });
}

function broadcast(data) {
  if (!wss) {
    console.error('WebSocket server is not initialized.');
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch (error) {
        console.error('Error broadcasting message:', error.message, error.stack);
      }
    }
  });
}

module.exports = {
  initialize,
  broadcast
};