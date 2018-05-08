var express = require('express');
var socket = require('socket.io');
//APP setup
var app = express();
var port = 3333;
var users = [{name: 'all', id: 'all'}];
var server = app.listen(port, () => {
    console.log("Listen to port", port);
});

//Static files
app.use(express.static('public'));

//Socket setup
var io = socket(server);

io.on('connection', socket => {

    //console.log('connected id:',socket.id);
    socket.on('connected',data =>{
        users.push({name:data,
            id:socket.id
        });
        io.sockets.emit('list',users);
       // console.log(users);
    });

    socket.on('chat',data =>{
        if(data.id == 'all'){
            io.sockets.emit('chat',data);
        } else {
            io.to(data.id).emit('chat',data);
        }
        //console.log(data);
    });

    socket.on('typing',data =>{
        if(data.id == undefined){
            socket.broadcast.emit('typing',data);
        } else {
            io.to(data.id).emit('typing',data);
        }
        //console.log(data.handle == undefined ? data : data.handle ,"is typing a message...");
    });
    
});