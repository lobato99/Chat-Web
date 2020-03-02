var express = require('express');
var app=express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var siofu = require("socketio-file-upload");
var usuarios=0;
app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
 });
 app.use(siofu.router);
app.use(express.static(__dirname+ '/public'));
io.on('connection', function(socket){
  var uploader = new siofu();
  uploader.dir = "public";
  uploader.listen(socket);
  socket.on('disconnect', function() {
    usuarios--;
    io.emit('usuarios', "Usuarios conectados: "+usuarios);
  });
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
    socket.on('conect', function(user){
      usuarios++;
      io.emit('conectado', user+" se ha conectado");
      io.emit('usuarios', "Usuarios conectados: "+usuarios);
    });
    socket.on('escribiendo', function(user){
      socket.broadcast.emit('escribiendo', user
      );
    });
  });
http.listen(3000, function(){
  console.log('listening on *:3000');
});