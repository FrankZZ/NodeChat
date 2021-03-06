var RoomFactory = require('./roomfactory');

var Client = function (socket)
{
	var self = this;

	self.socket = socket;
	self.nick = '';
	self.stack = {};
	self.room = null;

	self.requestedRoomList();

	socket.on('C_REQUEST_ROOMLIST', function (data)
	{
		self.requestedRoomList();
	});

	socket.on('C_SEND_NICK', function (data)
	{
		if ('nick' in data && data.nick.length !== 0)
		{
			self.nick = data.nick;
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
		if (data && data.length > 0)
			self.room.addLine(self, data, 'm');
	});

};

Client.prototype.requestedRoomList = function ()
{
	var self = this;
	
	self.socket.emit('S_SEND_ROOMLIST', RoomFactory.getRoomNames());
};

Client.prototype.joinRoom = function (room)
{
	var self = this;
	
	self.room = room;

	if (self.nick.length !== 0)
	{
		if (room.addUser(self) === false)
		{
			return false;
		}

		var croom = {'name': room.name};

		croom.userlist = [];

		/*for (var i = 0; i < room.users.length; i++)
		{
			var u = room.users[i];

			if (u !== undefined)
			{
				croom.userlist.push(u.nick);
			}
		}*/

		self.socket.emit('S_JOIN_ROOM', croom);

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