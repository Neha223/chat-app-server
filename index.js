const express = require('express')    // create an express server 
const app = express();   // create an instance of express and store it into app variable
var http = require('http').createServer(app);   // create server with http module
var cors = require('cors')

const socketIO = require('socket.io');
const io = socketIO(http);
app.use(cors())   // Enable cors to access with different host
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
const port = process.env.PORT || 3000;

// listen for the real time connection event
io.on('connection', (socket) => {  
    // When user connects to server           
    console.log('user connected');
    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    // Listen for event for new-message
    socket.on('new-message', (message) => {
        console.log("Message Received: " + message);   
        // Same time emit message event
        io.emit('new-message',message);
    });
    // For New User connection
    socket.on('new-user', (user) => {
        console.log("User joined: " + user);  
        io.emit('new-user',user);
    });
});
// Listen port
http.listen(port, () => {
    console.log(`started on port: ${port}`);
});