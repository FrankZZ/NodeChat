var Room = require('../models/room');

var rooms = [];

// Een nieuwe room maken en toevoegen aan de rooms array
addRoom = function(name)
{
	var id = rooms.length;

	rooms.push(Room.new(id, name));

	return rooms[id];

};

getRooms = function()
{
	return rooms;
};

exports.getRooms = getRooms;

deleteRoom = function (id)
{
	if (id in rooms)
	{
		rooms.splice(id, 1);
		return true;
	}
	return false;
}

exports.init = function ()
{
	addRoom('RedLightRoom');
	addRoom('LightRoom');
	addRoom('DarkRoom');

	console.log(rooms);

	return;
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

	return;
};

exports.add = function (req, res)
{
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(addRoom('Room ' + new Date().getTime())));

	return;
};

exports.list = function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(rooms));

	return;
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

	return;

};

exports.delete = function (req, res)
{
	var header = 500
		, id = req.params.id;

	if (deleteRoom(id))
	{
		header = 200;
	}

	res.writeHead(header);
	res.end();

	return;
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

	return;
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

	return;
};

exports.addLine = function (data)
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

	return;
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

	return;
};

exports.index = function (req, res)
{
	res.render('index',
		{
			'rooms': rooms
		}
	);
}

exports.room = function (req, res)
{
	var roomId = req.params.id;

	res.render('room',
		{
			'room': rooms[roomId]
		}
	);

	return;
}
