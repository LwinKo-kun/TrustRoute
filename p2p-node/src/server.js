const express = require('express');
const cors = require('cors');
const config = require('./config');
const { verifySignature, handleConsensusVote } = require('./consensus');

const app = express();
app.use(express.json());
app.use(cors());

// Standard JSON-RPC Endpoint
app.post('/rpc', (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  if (jsonrpc !== '2.0' || !method) {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request' },
      id: id || null,
    });
  }

  console.log(`[${config.nodeId}] Received RPC method: ${method}`);

  switch (method) {
    case 'ping':
      return res.json({ jsonrpc: '2.0', result: { status: 'alive', nodeId: config.nodeId }, id });

    case 'verifyOrder':
      const isValid = verifySignature(params);
      return res.json({ jsonrpc: '2.0', result: { valid: isValid }, id });

    case 'vote':
      const voteResult = handleConsensusVote(params);
      return res.json({ jsonrpc: '2.0', result: voteResult, id });

    default:
      return res.status(404).json({
        jsonrpc: '2.0',
        error: { code: -32601, message: 'Method not found' },
        id,
      });
  }
});

app.listen(config.port, () => {
  console.log(`P2P Validator Node [${config.nodeId}] running on port ${config.port}`);
});