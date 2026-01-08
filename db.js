const mongose = require('mongoose');
const mongoDBMemoryServer = require('mongodb-memory-server');

let mongoServer;
// connect to in-memory MongoDB server
async function connectMongoDB() {
    mongoServer = await mongoDBMemoryServer.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongose.connect(uri);
    return mongoServer
}

async function disconnectMongoDB() {
    await mongose.disconnect()
    if (mongoServer) await mongoServer.stop()
}
module.exports = { connectMongoDB, disconnectMongoDB };