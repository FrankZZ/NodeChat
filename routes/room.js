/*
 * GET rooms.
 */

var util = require('util');

var Room = function (id, name)
{
	this.id = id;
	this.name = name;
	this.lines = {};
}

Room.prototype.addLine = function (user, message)
{
	this.lines.push({"user": user, "message": message});

	console.log(this.name + ' <' + user + '>: ' + message);
}

Room.prototype.getLines = function ()
{
	return this.lines;
}

var rooms = [];

addRoom = function(name)
{
	var id = rooms.length;

	rooms.push(new Room(id, name));

	return rooms[id];

}



exports.init = function ()
{
	addRoom('FrankZZRoom');
	addRoom('JimZZRoom');
	addRoom('JeroenZZRoom');

	console.log(rooms);
}

exports.get = function (req, res)
{
	var header = 500;
	var msg = '[]';

	var id = req.params.id;

	if (id in rooms)
	{
		msg = JSON.stringify(rooms[id]);
		header = 200;
	}

	res.writeHead(header, {'Content-Type': 'application/json'});
	res.end(msg);
}

exports.add = function (req, res)
{
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(addRoom('Room ' + rooms.length.toString()));

}

exports.list = function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(rooms));
};

exports.update = function (req, res)
{

	var header = 500
		, msg = '[]'
		, id = req.params.id
		, name = req.body.name;

	if (name !== undefined && id in rooms)
	{
		rooms[id].name = name;

		header = 200;
		msg = JSON.stringify(rooms[id]);
	}

	res.writeHead(header, {'Content-Type': 'application/json'});
	res.end(msg);
}

exports.delete = function (req, res)
{
	var header = 500
		, id = req.params.id;

	if (id in rooms)
	{
		rooms.splice(id, 1);
		header = 200;
	}
	res.writeHead(header, {'Content-Type': 'application/json'});
	res.end();
}


