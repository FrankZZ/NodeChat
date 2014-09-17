
var AWS = require('aws-sdk');
var roomtable = require('../constants/roomtable');

AWS.config.loadFromPath('./config.json');

var dynamodb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });

var initializeTables = function ()
{
	// Create Rooms table
	dynamodb.createTable(roomtable, function (err, data)
	{
		if (err)
			console.log(err, err.stack);
		else
			console.log(data);
	});
}

module.exports.client = dynamodb;
module.exports.initializeTables = initializeTables;
