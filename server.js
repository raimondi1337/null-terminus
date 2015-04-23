var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

var clients = {};

app.listen(8080);

function handler (req, res) {
	//serve index.html
	fs.readFile('index.html', function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}

io.on('connection', function (socket) {
		socket.emit('identify', {id:socket.id, others:clients});

		socket.on('addPlayer', function (data){
			var newPlayer = data.id;
			clients[data.id]=data;
			socket.broadcast.emit('addPlayer', data);
		});

		socket.on('updatePlayer', function (data){
			clients[data.id]=data;
			socket.broadcast.emit('updatePlayer', data);
		});

		socket.on('disconnect', function (){
			var keys = Object.keys(clients);       
			for(var i = 0; i < keys.length; i++)
			{
				if(keys[i]==socket.id){
					console.log(keys[i] + ' disconnected');
					socket.broadcast.emit('removePlayer', keys[i]);
					delete clients[keys[i]];
				}
			}
		});
});
