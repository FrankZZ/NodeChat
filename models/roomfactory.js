var
	Room = require('./room'),
	db = require('./database').client,
	converter = require('../helpers/converter');

var rooms = [];

// Een nieuwe room maken en toevoegen aan de rooms array
addRoom = function(name)
{
	var id = rooms.length;
	var lines = [];
	var roomParams = {
		KeyConditions: {
			roomid: {
				ComparisonOperator: 'EQ',
				AttributeValueList: [
					{
						S: name
					}
				]
			}
		},
		TableName: 'Rooms',
		AttributesToGet: [
			'timestamp',
			'user',
			'message',
			'type'
		]
	};

	db.query(roomParams, function (err, data)
	{
		if (err)
		{
			console.log(err, err.stack);
		}
		else
		{
			console.log(data);

			lines = converter.ArrayConverter(data.Items);
		}

		rooms.push(Room.new(id, name, lines));
		return rooms[id];
	});



};

exports.getRooms = function()
{
	return rooms;
};

exports.getRoomNames = function ()
{
	var crooms = [];

	for (var i = 0; i < rooms.length; i++)
	{
		var r = rooms[i];
		
		if (r)
		{
			crooms.push({'name': r.name, 'id': i});
		}
	}
	return crooms;
}

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
