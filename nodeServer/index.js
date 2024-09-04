console.log('Server is starting');
const io = require('socket.io')(8000, {
    cors: {
        origin: "*", // Allow all origins or specify your frontend URL
        methods: ["GET", "POST"]
    }
});
console.log('Server has started');

const users = {};

io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    // When a new user joins the chat
    socket.on('new-user-joined', name => {
        console.log('New user:', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // When a user sends a message
    socket.on('send', message => {
        const userName = users[socket.id];
        console.log('Message from', userName, ':', message);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // When a user disconnects
    socket.on('disconnect', message => {
            socket.broadcast.emit('left', users[socket.id]);
            console.log('User disconnected:', userName);
            delete users[socket.id];
    
    });
});
