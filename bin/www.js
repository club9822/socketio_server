#!/usr/bin/env node


/**
 * Module dependencies.
 */
require('dotenv').config()
var app = require('../app');
var debug = require('debug')('socket:server');
var http = require('http');
var redisAdapter = require('socket.io-redis');
var moment = require('moment');
const Redis = require('ioredis');

const onError = require('../utils/errorHandling').onError
const normalizePort = require('../utils/errorHandling').normalizePort

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');

//https://github.com/socketio/socket.io-redis#cluster-example
const redisStartupNodes = [
  {
    port: process.env.REDIS_SERVER_1_PORT,
    host: process.env.REDIS_SERVER_1
  },
  {
    port: process.env.REDIS_SERVER_2_PORT,
    host: process.env.REDIS_SERVER_2
  },
];
const redisOptions = {
  slotsRefreshTimeout: 2000,
  dnsLookup: (address, callback) => callback(null, address),
  redisOptions: {
    tls: {},
    // password: process.env.REDIS_PASS,
  },
}
app.set('port', port);



/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


// var io = require('socket.io')(server,{
//   path:'/socket.io',
//   cors: {
//     origin: "*",
//   }});
var io = require('socket.io')(server);
// TODO: complete in linux env
// have problem in window 10
// io.adapter(redisAdapter({
//   pubClient: new Redis.Cluster(redisStartupNodes,redisOptions),
//   subClient: new Redis.Cluster(redisStartupNodes,redisOptions)}));
io.adapter(redisAdapter({ host: process.env.REDIS_SERVER_1, port: process.env.REDIS_SERVER_1_PORT }));

const nameSpace = '/';

io.on('connection', function(socket) {
    console.log('____________________________________________________________________')
    console.log('connection',socket)
    console.log('____________________________________________________________________')
   socket.on('disconnect',async function() {
    try {
      await io.of(nameSpace).adapter.remoteDisconnect(socket.id, true);
    } catch (e) {
      // the socket was not found
    }
  });

  socket.on('joinRoom', async function(req,err,cb) {
    const {username}=socket?.handshake?.headers
    console.log('joinRoom::::: username:',username )
    const {roomId,userId} = req
    if(!roomId || !userId){
      if(err){
        err('userId or roomId error')
      }
      return;
    }
    try {
      await io.of(nameSpace).adapter.remoteJoin(userId, roomId);
      await socket.broadcast.to(roomId).emit(
        '_user_join', {
          message: userId + '  :::: has joined!',
          timestamp: moment().valueOf(),
          roomId: roomId,
          userId: userId,
          username: username,
      });
      if(cb){
        cb(true)
      }
    } catch (e) {
      if(err){
        err(e)
      }
      // the socket was not found
    }
  });
  socket.on('leaveRoom', async function(req,cb) {
    console.log('leaveRoom::::>>><<<:',req,cb)
    const {roomId,userId} = req
    if(!roomId || !userId){
      if(cb){
        cb('userId or roomId error::::'+JSON.stringify(req),false)
      }
      return;
    }
    try {
      await io.of(nameSpace).adapter.remoteLeave(userId, roomId);
      await socket.broadcast.to(roomId).emit(
        '_user_leave', {
          message: userId + '  :::: has leave room!',
          timestamp: moment().valueOf(),
          roomId:roomId,
          userId:userId
        });
      if(cb){
        cb(undefined,true)
      }
    } catch (e) {
      if(cb){
        cb(e,false)
      }
      // the socket was not found
    }

  });

  socket.on('message', function(to,message) {
    console.log('message::::::',message)
    io.to(to).emit('message', message);
  });

  // socket.emit('message', {
  //   username: 'System',
  //   text: 'Hey there! Ask someone to join this chat room to start talking.',
  //   timestamp: moment().valueOf()
  // });

  socket.on('typing', function(req) {
      const {roomId,userId} = req
      socket.broadcast.to(roomId).emit(
      'typing', {
        message: userId + '  :::: has joined!',
        timestamp: moment().valueOf(),
        roomId:roomId,
        userId:userId
      });
  });
  socket.on('stoppedTyping', function(req) {
      const {roomId,userId} = req
      socket.broadcast.to(roomId).emit(
      'typing', {
        message: userId + '  :::: has joined!',
        timestamp: moment().valueOf(),
        roomId:roomId,
        userId:userId
      });
  });
  socket.on('removeTyping', function(req) {
    // socket.broadcast.emit('removeTyping', name);
  });



  socket.on('allSocketsInRoom', async function(req,cb) {
    console.log('allSocketsInRoom',req)
    // console.log('allSocketsInRoom::???: : ',typeof req,req,cb)
    const {roomId} = req
    let sockets= []
    try {
      if(!roomId){
        new Error('roomId')
      }
      sockets = await io.of(nameSpace).adapter.sockets(new Set([roomId]));
      // console.log('sockets:::',JSON.stringify(sockets))
      if(cb){
        cb(undefined,Array.from(sockets))
      }
    }catch (e) {
      if(cb) {
        cb(e, [])
      }
    }finally {

    }
  });



  socket.on('allRooms', async function(cb) {
    console.log('allRooms',cb)
    let rooms= new Set()
    try {
      rooms = await io.of(nameSpace).adapter.allRooms();
      // console.log('rooms:::',Array.from(rooms),)
      if(cb){
        cb(undefined,Array.from(rooms))
      }
    }catch (e) {
      if(cb) {
        cb(e, [])
      }
    }finally {

    }
  });

});

// io.of(nameSpace).adapter.pubClient.on('error', function(e){
//   console.log('log::io:p:',e)
// });
// io.adapter.subClient.on('error', function(e){
//   console.log('log::io:s:',e)
// });







/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
