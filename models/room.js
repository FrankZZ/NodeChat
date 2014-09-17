// Room klasse
var db = require('./database').client;

var Room = function (id, name, lines)
{
	var self = this;

	self.id = id;
	self.name = name;
	self.users = [];
	self.lines = lines;
};

// Voeg een line toe
Room.prototype.addLine = function (user, message, type)
{
	var self = this;
	var timestamp = new Date().getTime();
	var line = {
			'user': user.nick,
			'timestamp': Math.round(timestamp / 1000),
			'message': message,
			'type': type
	};

	var putLineParams = {
		Item: {
			roomid: {
				S: self.name
			},
			timestamp: {
				S: timestamp.toString()
			},
			user: {
				S: user.nick
			},
			message: {
				S: message
			},
			type: {
				S: type
			}
		},
		TableName: 'Rooms'
	};

	db.putItem(putLineParams, function (err, data)
	{
		if (err) console.log(err, err.stack);
		else console.log(data);
	})

	self.lines.push(line);

	self.sendLine(line);


	console.log(self.name + ' <' + user.nick + '>: ' + message);
	return true;
};

Room.prototype.sendLine = function (line)
{
	var self = this;
	console.log(line.message);
	self.emit('S_NEW_LINE', line);
}

// Return alle lines die geschreven zijn
Room.prototype.getLines = function ()
{
	var self = this;

	return self.lines;
};

Room.prototype.emit = function (name, data)
{
	var self = this;

	for (var i = 0; i < self.users.length; i++)
	{
		var user = self.users[i];
		if (user !== undefined)
		{
			user.emit(name, data);
		}
	}
};

// Voeg een gebruiker toe aan de room (username string = id)
Room.prototype.addUser = function (user)
{
	var self = this;

	for (var i = 0; i < self.users.length; i++)
	{
		var u = self.users[i];

		if (u !== undefined)
		{
			if (u.nick === user.nick)
			{
				return false;
			}
		}
	}

	self.users.push(user);

	self.announceUsers();

	var lines = self.getLines();

	console.log('Sending all lines to ' + user.nick);

	for (var i = 0; i < lines.length; i++)
	{
		var line = lines[i];
		user.sendLine(line);
	}
	self.addLine(user, 'joined', 'j');

	return true;
};

Room.prototype.announceUsers = function ()
{
	var self = this;

	var userlist = [];

	for (var i = 0; i < self.users.length; i++)
	{
		var u = self.users[i];

		if (u !== undefined)
		{
			userlist.push(u.nick);
		}
	}

	self.emit('S_SEND_USERLIST', userlist);
}

// Verwijder een user uit de room
Room.prototype.delUser = function (user)
{
	var self = this;

	for (var i = 0; i<self.users.length; i++)
	{
		if (self.users[i] === user)
		{
			self.addLine(user, 'left', 'p');
			delete self.users[i];
			self.announceUsers();
			return true;
		}
	}
	return false;
};

// Vraag alle users op uit de room
Room.prototype.getUsers = function ()
{
	var self = this;

	return self.users;
};

exports.new = function(id, name, lines)
{
	return new Room(id, name, lines);
}

