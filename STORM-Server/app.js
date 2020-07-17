var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
app.io = require('socket.io')();



let status = []


app.io.on('connection',(socket) => {

  console.log(socket.id + "가 들어왔다.");

  socket.on('joinRoom', roomCode => {

    socket.join(roomCode, () => {
      
      if(!status.hasOwnProperty(roomCode)){
        //호스트가 처음으로 들어오면 status를 false로 초기화
        status[roomCode] = false;
        console.log(socket.id);
      }else{
        //멤버가 들어올 경우 status는 이미 존재하기 때문에 여기로 들어옴

        if(status[roomCode] === true){
          app.io.to(roomCode).emit('roundComplete', status[roomCode]);
        }

        //만약에 true가 아니면 걍 ... 지나감
        console.log(socket.id);
      }
    });
  });

    socket.on('roundSetting', (roomCode) => {
      status[roomCode] = true
      app.io.to(roomCode).emit('roundComplete');
    });
    
    socket.on('nextRound', (roomCode) => {
      status[roomCode] = false;
      app.io.to(roomCode).emit('memberNextRound', status[roomCode]);
    });

    socket.on('finishProject', (roomCode) => {
      app.io.to(roomCode).emit('memberFinishProject', roomCode);
    });

    socket.on('leave', (roomCode) => {
      socket.leave(roomCode, () => {
        app.io.to(roomCode).emit('roundComplete');
      });
    });

    socket.on('disconnect', () => {
      console.log(socket.id + '나감.');
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
