const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const exphbs = require("express-handlebars");

let users = [];

let scripts = [
    {script: "https://code.jquery.com/jquery.js"},
    {script: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"},
    {script: "js/main.js"},
    {script: "/socket.io/socket.io.js"},
]

const port = process.env.PORT || 3000;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, 'public')));

//socket connection
io.sockets.on('connection', (socket) => {
    socket.on('set user', (data, callback) => {
        if(users.indexOf(data) !== -1){
            callback(false);
        }
        else{
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateUsers();
        }
    });

    socket.on('send message', function(data){
        io.sockets.emit('show message', {msg: data, user: socket.username});
    })

    socket.on('disconnect', function(data){
        console.log('disconnect called');
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsers();
    });
});



const updateUsers = () => {
    console.log(users);
    io.sockets.emit('users', users);
}

app.get('/', (req, res, next) => {
    res.render('index', {scripts: scripts});
});

server.listen(port, () => {
    console.log('server on port'+port);
});

