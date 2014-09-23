// HTTP Portion

// require http - node module
var http = require('http');
// require the filesystem module
var fs = require('fs');

//instantiate the server - asks for a function that's going to handle a request
var httpServer = http.createServer(requestHandler);
httpServer.listen(8000);

function requestHandler(req, res) {
	console.log("Got a request" + req);

	// anybody that comes to this site and makes a request, is going to get index.html
	fs.readFile(__dirname + '/index.html', 
		// Callback function for reading - anonymous function - if there's an error, it returns a message
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading canvas_socket.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

// WebSocket Portion
// WebSockets work with the HTTP server

// An instance "io" of the socket.io library
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
	// We are given a WS object in our function
	function (socket) {
		console.log("We have a new client: " + socket.id);

		// This is coming from the client, when the event 'click' happens, 
		// we get the click position and generate a new walker at clickPos
		socket.on('circleClick', function(clickPos){
			console.log('Click Registered at: ' + clickPos.x + " " + clickPos.y);
			socket.broadcast.emit('clickFromServer', clickPos)
		});

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});

	}
);

