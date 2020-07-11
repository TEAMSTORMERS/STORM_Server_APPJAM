var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
/*
app.io = require(socket.io);

let room = [];

app.io = require('socket.io')();
app.io.on('connection',(socket) => {

  console.log("유저가 들어왔다.")

  // socket.on('createRoom', (code) => {
  //   room.push(code);
  // })

  // 요거 추가
  socket.on('joinRoom', (code) => {
    // socket.join(code, () => {
    //   app.io.to(code).emit('joinRoom', code);
    //   console.log('아무거나')
    // });
    console.log(code)
  

    // socket.join(room[num], () => {
    //   app.io.to(room[num]).emit('joinRoom', num, name);
    // });
  });

  // 요거 추가
  socket.on('leaveRoom', (num, name) => {
    socket.leave(room[num], () => {
      app.io.to(room[num]).emit('leaveRoom', num, name);
    });
  });

  socket.on('disconnect', () => {
    console.log('유저가 나갔다.');
  });
});

*/


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
