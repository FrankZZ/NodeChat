var express = require('express')
	, room = require('./routes/room')
	, path = require('path')
	, app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server)
	, fs = require('fs')
	, sock = require('./models/socket')
	, client = require('./models/client');

app.configure(function ()
{
	app.set('port', process.env.PORT || 3000);
	app.use(express.static('client'));
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
});

app.get('/room/:id(\\d+)', room.room);

//======== Room functies ==========

// Alle rooms in een lijst weergeven
app.get('/rooms', room.list);

// Details van een room weergeven
app.get('/rooms/:id(\\d+)', room.get);

// Room toevoegen met auto-id en auto-naam
app.post('/rooms', room.add);

// Room verwijderen met meegegeven id
app.delete('/rooms/:id(\\d+)', room.delete);

// Room updaten met een nieuwe naam
app.put('/rooms/:id(\\d+)', room.update);

//======== Chat functies ==========

// User toevoegen aan een Room
app.post('/rooms/:id(\\d+)/users', room.addUser);

// User verwijderen uit een Room
app.delete('/rooms/:id(\\d+)', room.delUser);

// User een line laten sturen naar een Room
app.post('/rooms/:id(\\d+)/users/:userid(\\w+)/lines', room.addLine);

// Alle lines van een room weergeven
app.get('/rooms/:id(\\d+)/lines', room.getLines);

// Nieuwe socket incoming
io.sockets.on('connection', function (socket)
{
	var user = client.new(sock.new(socket));
	user.room = room.getRooms()[1];
});

server.listen(app.get('port'), function ()
{
	console.log("Express server listening on port " + app.get('port'));
});

room.init();
