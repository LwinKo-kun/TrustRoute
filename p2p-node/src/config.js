require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  nodeId: process.env.NODE_ID || 'Node_Default',
  laravelUrl: process.env.LARAVEL_URL || 'http://127.0.0.1:8000/api',
};