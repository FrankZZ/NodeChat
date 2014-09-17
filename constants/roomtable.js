var params = {
	AttributeDefinitions: [
		{
			AttributeName: 'roomid',
			AttributeType: 'S'
		},
		{
			AttributeName: 'timestamp',
			AttributeType: 'S'
		}/*,
		{
			AttributeName: 'user',
			AttributeType: 'S'
		},
		{
			AttributeName: 'message',
			AttributeType: 'S'
		},
		{
			AttributeName: 'type',
			AttributeType: 'S'
		}*/
	],
	KeySchema: [
		{
			AttributeName: 'roomid',
			KeyType: 'HASH'
		},
		{
			AttributeName: 'timestamp',
			KeyType: 'RANGE'
		}
	],
	ProvisionedThroughput: {
		ReadCapacityUnits: 1,
		WriteCapacityUnits: 1
	},
	TableName: 'Rooms'
}

module.exports = params;