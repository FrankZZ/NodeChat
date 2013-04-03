var Room = require('./room');

var rooms = [];

// Een nieuwe room maken en toevoegen aan de rooms array
addRoom = function(name)
{
	var id = rooms.length;

	rooms.push(Room.new(id, name));

	return rooms[id];

};

exports.getRooms = function()
{
	return rooms;
};

deleteRoom = function (id)
{
	if (id in rooms)
	{
		rooms.splice(id, 1);
		return true;
	}
	return false;
}

exports.getRoom = function (id)
{
	var room = rooms[id];
	
	if (room)
	{
		return room;
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