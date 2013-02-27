var io = require('socket.io');

var Socket = function (socket)
{
	var self = this;

	self.socket = socket;
	self.stack = [];

	socket.on('OK', function (data)
	{
		console.log('fra' + data);
	});
};

Socket.prototype.emit = function (name, data)
{
	var self = this;

	self.stack.push({'name': name, 'data': data});
	console.log('name' + name);
	console.log('data' + data);
	self.socket.emit(name, data);
}

Socket.prototype.on = function (name, func)
{
	var self = this;

	self.socket.on(name, func);
}

exports.new = function (socket)
{
	return new Socket(socket);
}