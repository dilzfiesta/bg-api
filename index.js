'use strict';

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var http = require('http');

var connectionString = process.env.biovotionbgiothub;
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  var temperature = 20 + (Math.random() * 15);
  var message = new Message(JSON.stringify({
    temperature: temperature,
    humidity: 60 + (Math.random() * 20),
    
    // Enhancement: Adding wind to the message
    wind: 5 + (Math.random() * 10)
  }));

  message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');

  // Send the message.
  client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
  });
 
  response.end('Sending message: ' + message.getData());
});

var port = process.env.PORT || 1337;
server.listen(port);