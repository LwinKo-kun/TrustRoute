async function sendRpcRequest(peerUrl, method, params) {
  try {
    const response = await fetch(peerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: Date.now(),
      }),
    });
    const data = await response.json();
    return data.result;
  } catch (err) {
    console.error(`Failed to connect to peer at ${peerUrl}:`, err.message);
    return null;
  }
}

module.exports = { sendRpcRequest };