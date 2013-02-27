var Client = function (socket)
{
	var self = this;

	self.socket = socket;
	self.nick = '';
	self.stack = {};
	self.room = null;

	socket.emit('S_REQUEST_NICK');

	socket.on('C_SEND_NICK', function (data)
	{
		if ('nick' in data && data.nick.length !== 0)
		{
			self.nick = data.nick;
			self.joinRoom(self.room);
		}
		socket.emit('OK', 'C_SEND_NICK');
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
		room.addUser(self);

		console.log('Joined room ' + room.name);

		self.socket.on('disconnect', function ()
		{
			self.room.delUser(self);
		});
	}

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