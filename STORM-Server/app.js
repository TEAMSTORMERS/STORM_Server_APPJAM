var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
app.io = require('socket.io')();

app.io.on('connection',(socket) => {

  console.log(socket.id + "가 들어왔다.");



let room = {};

app.io.on('connection',(socket) => {

  console.log(socket.id + "가 들어왔다.");

  socket.on('joinRoom', (projectCode) => {
    const [roomCode, username] = projectCode;

      socket.join(roomCode, () => {
        app.io.to(roomCode).emit('roomState', `${socket.id}`);
      });
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



  socket.on('leave', (roomCode) => {
    socket.leave(roomCode, () => {
      app.io.to(roomCode).emit('leaveProject', "test")
    });
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
