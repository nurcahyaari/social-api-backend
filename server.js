'use strict';

const app = require('./app');
const mongose = require('mongoose');
const db = require('./db');
const seederData = require('./seeder');

mongose.connection.on('connected', () => {
  console.log('[MongoDB] Connected')
});

mongose.connection.on('error', err => {
  console.error('[MongoDB] Connection error:', err)
});

mongose.connection.on('disconnected', () => {
  console.log('[MongoDB] Disconnected')
});


// start server
async function startServer() {
  try {
    const mongoServer = await db.connectMongoDB();
    await seederData();

    const port =  process.env.PORT || 3000;

    const server = app.listen(port);
    console.log('Express started. Listening on %s', port);
    process.on('SIGINT', async () => {
      await mongose.disconnect()
        if (mongoServer) await mongoServer.stop()
        process.exit(0)
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

startServer()
