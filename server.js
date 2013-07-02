MODULE_DIR = './lib/node_modules/';
REDIS_HOST = '127.0.0.1';
REDIS_PORT = '6379';

var http = require('http');
var redis = require(MODULE_DIR + 'redis');

var redis_client = redis.createClient(REDIS_PORT, REDIS_HOST);
var server_port = process.argv[2];
var duck_status_key = "duck-status";

var http_server = http.createServer(function(request, response) {
  switch(request.url) {
    case "/":
      redis_client.get(duck_status_key, function (err, reply) {
        if(reply != null) {
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end(reply);
        }
        else {
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end('unknown');
        }
      });
      break;
      
    case "/api/ducks-in":
      redis_client.set(duck_status_key, "no", redis.print);
      console.log("Ducks have been put inside.");
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end("I trust that you put the ducks inside.");
      break;
      
    case "/api/ducks-out":
      redis_client.set(duck_status_key, "yes", redis.print);
      console.log("Ducks have been let outside.");
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end("I trust that you let the ducks outside.");
      break;
      
    default:
      console.log("bad request: " + request.url);
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.end("SERVER ERROR!.");
  }
}).listen(server_port);