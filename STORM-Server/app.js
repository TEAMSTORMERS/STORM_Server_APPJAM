var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
app.io = require('socket.io')();

let room = {};

app.io.on('connection',(socket) => {

  console.log(socket.id + "가 들어왔다.");

  socket.on('joinRoom', (projectCode) => {

    const [roomCode, username] = projectCode;

    if(!room.hasOwnProperty(roomCode)){
      socket.join(roomCode, () => {
        room[roomCode] = {};
        room[roomCode].userList = [];
        room[roomCode].socketId = [];
        room[roomCode].userList.push(username);
        room[roomCode].socketId.push(socket.id);
        console.log("1");
        app.io.to(socket.id).emit('roomState', room[roomCode].socketId);
      });
    } else {
      room[roomCode].userList.push(username);
      room[roomCode].socketId.push(socket.id);
      console.log("2");
      app.io.to(socket.id).emit('roomState', room[roomCode].socketId);
    }

  });
  
  
  socket.on('leaveRoom', (projectCode) => {
    const [roomCode, username] = projectCode;

    if(room[roomCode].userList.length === 0){
        socket.leave(roomCode, () => {
        console.log("3");
        app.io.to(socket.id).emit('roomState', "방이 사라집니다.");
      });
    }else{
      for(i = 0; i<room[roomCode].userList.length; i++){
        //room[roomCode].socketId.splice(room[roomCode].socketId.indexOf(socket.id),1);
        if(room[roomCode].socketId[i] === socket.id){
          console.log("4");
          room[roomCode].userList.splice(i, 1);
          room[roomCode].socketId.splice(i, 1);
        }
      }
      app.io.to(socket.id).emit('roomState', room[roomCode].socketId);
    }
  });
  
  
  socket.on('startProject', (roomCode) => {
    try{
      for(i = 0; i<=room[roomCode].userList.length; i++){
        app.io.to(room[roomCode].socketId[i]).emit('participantPOST');
      }
    }catch(err){
      console.log(err);
    }
  });

  socket.on('roundSetting', (roomCode) => {
    try{
      for(i = 0; i<=room[roomCode].userList.length; i++){
        app.io.to(room[roomCode].socketId[i]).emit('roundReady');
      }
    }catch(err){
      console.log(err);
    }
  });

  socket.on('roundSettingFin', (roomCode) => {
    try{
      for(i = 0; i<=room[roomCode].userList.length; i++){
        app.io.to(room[roomCode].socketId[i]).emit('roundSet');
      }
    }catch(err){
      console.log(err);
    }
  });
  
  socket.on('startRound', (roomCode) => {
    try{
      for(i = 0; i<=room[roomCode].userList.length; i++){
        app.io.to(room[roomCode].socketId[i]).emit('pass');
      }
    }catch(err){
      console.log(err);
    }
  });

  socket.on('disconnect', () => {
    console.log(socket.id+'나감.');
  });
});


  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);


  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
