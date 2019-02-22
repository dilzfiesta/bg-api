'use strict';

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var http = require('http');

var connectionString = process.env.biovotionbgiothub;
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  var message = new Message(JSON.stringify({
    
    // Body temperature of the patient
    temperature: Math.round(20 + (Math.random() * 15)),
    
    // Surrounding humidity
    humidity: Math.round(30 + (Math.random() * 20)),
    
    // Enhancement: Adding heart rate in beats per min. of the patient
    heartrate: Math.round(40 + (Math.random() * 10))
    
  }));

  //message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');

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
