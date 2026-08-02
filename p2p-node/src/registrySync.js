const config = require('./config');

async function sendHeartbeat() {
  try {
    await fetch(`${config.laravelUrl}/nodes/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        node_id: config.nodeId,
        port: config.port,
        status: 'active',
      }),
    });
    console.log(`[Heartbeat] Registered ${config.nodeId} with Laravel coordinator.`);
  } catch (err) {
    console.error('[Heartbeat] Could not reach Laravel registry:', err.message);
  }
}

// Run heartbeat every 30 seconds
setInterval(sendHeartbeat, 30000);