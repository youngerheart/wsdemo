// 这个模块的主要功能是加密解密
var crypto = require('crypto');
var port = 8080;

// 需要针对Sec-WebSocket-Key生成Sec-WebSocket-Accept 的key
// Sha1(Sec-WebSocket-Key+258EAFA5-E914-47DA-95CA-C5AB0DC85B11)

require('net').createServer(function(request) {
  var key;
  request.on('data', function(e) {
    if(!key) {
      // 生成key
      key = e.toString().match(/Sec-WebSocket-Key: (.+)/)[1] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
      key=crypto.createHash('sha1').update(key).digest('base64');
      // 输出返回给客户端的数据，这些字段都是必须的
      request.write('HTTP/1.1 101 Switching Protocols\r\n');
      request.write('Upgrade: websocket\r\n');
      request.write('Connection: Upgrade\r\n');
      // 这个字段带上服务器处理后的KEY
      request.write('Sec-WebSocket-Accept: '+key+'\r\n');
      // 输出空行，使HTTP头结束
      request.write('\r\n');
    }
  });
}).listen(port);

console.log('socketServer running in port ' + port);