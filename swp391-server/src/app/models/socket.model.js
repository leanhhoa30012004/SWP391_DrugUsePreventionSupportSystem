let io;
const userSockets = {};

function initSocket(server) {
    const socketIO = require('socket.io');
    io = socketIO(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('register_user', (userId) => {
            userSockets[userId] = socket.id;
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        socket.on('disconnect', () => {
            for (const [uid, sid] of Object.entries(userSockets)) {
                if (sid === socket.id) delete userSockets[uid];
            }
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

function emitToUser(userId, event, data) {
    const socketId = userSockets[userId];
    if (io && socketId) {
        io.to(socketId).emit(event, data);
    }
}

function getIO() {
    return io;
}

module.exports = { initSocket, emitToUser, getIO };
