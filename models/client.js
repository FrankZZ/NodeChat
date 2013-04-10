var RoomFactory = require('./roomfactory');

var Client = function (socket)
{
	var self = this;

	self.socket = socket;
	self.nick = '';
	self.stack = {};
	self.room = null;

	// Nick opvragen van client
	socket.emit('S_REQUEST_NICK', false);

	socket.on('C_SEND_NICK', function (data)
	{
		if ('nick' in data && data.nick.length !== 0)
		{
			self.nick = data.nick;

			// Room opvragen aan client
			socket.emit('S_REQUEST_ROOM', false);
		}
		
		socket.emit('OK', 'C_SEND_NICK');
	});

	socket.on('C_JOIN_ROOM', function(data)
	{
		var room = RoomFactory.getRoom(data);
		
		if (room)
		{
			self.joinRoom(room);
		}
	});

	socket.on('C_NEW_LINE', function (data)
	{
		self.room.addLine(self, data, 'm');
	});

};

Client.prototype.joinRoom = function (room)
{
	var self = this;

	if (self.nick.length !== 0)
	{
		if (room.addUser(self) === false)
		{
			return false;
		}

		console.log('Joined room ' + room.name);

		self.socket.on('disconnect', function ()
		{
			if (self.room)
			{
				self.room.delUser(self);
			}
		});
	}
	return true;
}

Client.prototype.sendLine = function (line)
{
	var self = this;
	self.emit('S_NEW_LINE', line);
}

Client.prototype.emit = function (name, data)
{
	var self = this;

	self.socket.emit(name, data);
}

exports.new = function (socket)
{
	return new Client(socket);
}