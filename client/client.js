var socket = io.connect('http://82.169.148.99:3000');

socket.on('S_REQUEST_NICK', function ()
{
	var nick = null;

	while (!nick)
	{
		nick = prompt('Input a nickname', 'Guest' + Math.round(Math.random()*100))
	}

	socket.emit('C_SEND_NICK', { 'nick': nick });
});

socket.on('S_SEND_USERLIST', function (data)
{
	var div = document.getElementById('userlist');

	var ul = document.createElement('ul');
	for (var i = 0; i < data.length; i++)
	{
		var user = data[i];
		var li = document.createElement('li');

		li.innerHTML = user;

		ul.appendChild(li);
	}

	while (div.hasChildNodes())
	{
		div.removeChild(div.lastChild);
	}
	div.appendChild(ul);
});


submitLine = function ()
{
	var input = document.getElementById('message');

	socket.emit('C_NEW_LINE', input.value);
}

appendLine = function (line)
{
	var div = document.getElementById('lines');
	if (line.type == 'm')
	{
		div.innerHTML += '<br />&lt;<span style="font-weight: bold">' + line.user + '</span>&gt;: ' + line.message;
	}
	else if (line.type == 'j')
	{
		div.innerHTML += '<br /><span style="color: #00ff00; font-style: italic">' + line.user + ' joined</span>';
	}
	else if (line.type == 'p')
	{
		div.innerHTML += '<br /><span style="color: #ff0000; font-style: italic">' + line.user + ' left</span>';
	}

}

socket.on('S_NEW_LINE', appendLine);
