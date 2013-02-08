var express = require('express')
		, routes = require('./routes')
		, room = require('./routes/room')
		, http = require('http')
		, path = require('path');

var app = express();

app.configure(function ()
{
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function ()
{
	app.use(express.errorHandler());
});

app.get('/', routes.index);

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

app.listen(app.get('port'), function ()
{
	console.log("Express server listening on port " + app.get('port'));
});

room.init();
