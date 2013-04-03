// Import jQuery into scope.
(function($)
{
	// Dom ready.
	$(function()
	{
		var socket = io.connect('http://localhost:3000');

		socket.on('S_REQUEST_NICK', function ()
		{
			var nick = null;

			while (!nick)
			{
				nick = prompt('Input a nickname', 'Guest' + Math.round(Math.random()*100))
			}

			socket.emit('C_SEND_NICK', { 'nick': nick });
		});

		socket.on('S_REQUEST_ROOM', function ()
		{
			socket.emit('C_JOIN_ROOM', 1);
		});

		socket.on('S_JOIN_ROOM', function (data)
		{
			$('#room').html(data.name);
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
			var chat = $('#chat')

			var div = document.getElementById('lines');
			if (line.type == 'm')
			{
				chat.prepend('<li />').html(formatTime(new Date(line.timestamp * 1000)) + '<span style="font-weight: bold">' + ' &lt;' + line.user + '</span>&gt;: ' + line.message);

				//div.innerHTML = formatTime(new Date(line.timestamp * 1000)) + '<span style="font-weight: bold">' + ' &lt;' + line.user + '</span>&gt;: ' + line.message + '<br />' + div.innerHTML;
			}
			else if (line.type == 'j')
			{
				chat.prepend('<li />').html(formatTime(new Date(line.timestamp * 1000)) + ' ' + '<span style="color: #00ff00; font-style: italic">' + line.user + ' joined</span>');

				//div.innerHTML = formatTime(new Date(line.timestamp * 1000)) + ' ' + '<span style="color: #00ff00; font-style: italic">' + line.user + ' joined</span><br />' + div.innerHTML;
			}
			else if (line.type == 'p')
			{
				chat.prepend('<li />').html(formatTime(new Date(line.timestamp * 1000)) + ' ' + '<span style="color: #00ff00; font-style: italic">' + line.user + ' joined</span>');
				
				//div.innerHTML = formatTime(new Date(line.timestamp * 1000)) + ' ' + '<span style="color: #ff0000; font-style: italic">' + line.user + ' left</span><br />' + div.innerHTML;
			}

		}

		formatTime = function (time)
		{
			return '[' + zeroPad(time.getHours()) + ':' + zeroPad(time.getMinutes()) + ':' + zeroPad(time.getSeconds()) + ']';
		}

		zeroPad = function (number)
		{
			if (number <= 9)
			{
				return '0' + number;
			}
			return '' + number;
		}

		socket.on('S_NEW_LINE', appendLine);
	});
})(jQuery);