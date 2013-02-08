// Room klasse
var Room = function (id, name)
{
	this.id = id;
	this.name = name;
	this.users = {};
	this.lines = [];
};

// Voeg een line toe
Room.prototype.addLine = function (user, message)
{
	this.lines.push({"user": user, "message": message});

	console.log(this.name + ' <' + user + '>: ' + message);
	return true;
};

// Return alle lines die geschreven zijn
Room.prototype.getLines = function ()
{
	return this.lines;
};

// Voeg een gebruiker toe aan de room (username string = id)
Room.prototype.addUser = function (username)
{
	if ((username in this.users) == false)
	{
		this.users[username] = null;

		return true;
	}

	return false;
};

// Verwijder een user uit de room
Room.prototype.delUser = function (username)
{
	if (username in this.users)
	{
		delete this.users[username];

		return true;
	}

	return false;
};

// Vraag alle users op uit de room
Room.prototype.getUsers = function ()
{
	return this.users;
};

var rooms = [];

// Een nieuwe room maken en toevoegen aan de rooms array
addRoom = function(name)
{
	var id = rooms.length;

	rooms.push(new Room(id, name));

	return rooms[id];

};



exports.init = function ()
{
	addRoom('RedLightRoom');
	addRoom('LightRoom');
	addRoom('DarkRoom');

	console.log(rooms);
};

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
};

exports.add = function (req, res)
{
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(addRoom('Room ' + new Date().getTime())));

};

exports.list = function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(rooms));
};

exports.update = function (req, res)
{
	var header = 400
			, msg = '[]'
			, id = req.params.id
			, name = req.body.name;

	if ('content-type' in req.headers)
	{
		var head = req.headers['content-type'];

		if (head.split(';', 1) == 'application/json')
		{
			if (name !== undefined && id in rooms)
			{
				rooms[id].name = name;

				header = 200;
				msg = JSON.stringify(rooms[id]);
			}
		}
	}

	res.writeHead(header, {'Content-Type': 'application/json'});
	res.end(msg);
};

exports.delete = function (req, res)
{
	var header = 500
		, id = req.params.id;

	if (id in rooms)
	{
		rooms.splice(id, 1);
		header = 200;
	}
	res.writeHead(header);
	res.end();
};


exports.addUser = function (req, res)
{
	var header = 500
			, id = req.params.id
			, username = req.body.id;

	if (username !== undefined && id in rooms)
	{
		var room = rooms[id];

		if (username in room.getUsers())
		{
			header = 409; // HTTP 1.1/ 409 CONFLICT
		}
		else
		{
			if (room.addUser(username) == true)
			{
				header = 200; // HTTP 1.1/ 200 OK
			}
		}

	}

	res.writeHead(header);
	res.end();
};

exports.delUser = function (req, res)
{
	var header = 500
			, id = req.params.id
			, username = req.params.body.id;

	if (username !== undefined && id in rooms)
	{
		var room = rooms[id];
		if (room.delUser(username) == true)
		{
			header = 200; // HTTP 1.1 /200 OK
		}
		else
		{
			header = 409; // HTTP 1.1 /409 CONFLICT
		}
	}

	res.writeHead(header);
	res.end();
};

exports.addLine = function (req, res)
{
		//TODO compleet maken van addLine
	var roomId = req.params.id
			, username = req.params.userid
			, line = req.body.line
			, header = 500;

	if (roomId in rooms)
	{
		var room = rooms[roomId];

		if (room.addLine(username, line) == true)
		{
			header = 200;
		}
		else
		{
			header = 400;
		}
	}

	res.writeHead(header);
	res.end();
};

exports.getLines = function (req, res)
{
	var roomId = req.params.id
			, header = 500
			, msg = null;

	if (roomId in rooms)
	{
		var room = rooms[roomId];

		msg = JSON.stringify(room.getLines());
		header = 200;
	}

	res.writeHead(header, {'Content-Type': 'application/json'});
	res.end(msg);

};