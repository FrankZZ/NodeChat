/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, room = require('./routes/room')
	, http = require('http')
	, path = require('path');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});

app.get('/', routes.index);

// Alle rooms in een lijst weergeven
app.get('/rooms', room.list);

// Details van een room weergeven
app.get('/rooms/:id([0-9]+)', room.get);

// Room toevoegen met auto-id en auto-naam
app.post('/rooms', room.add);

// Room verwijderen met meegegeven id
app.delete('/rooms/:id([0-9]+)', room.delete);

// Room updaten met een nieuwe naam
app.put('/rooms/:id([0-9]+)', room.update);


http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});

room.init();