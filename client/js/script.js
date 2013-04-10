(function($)
{
	$(function()
	{
		var socket = null,
			username = null,
				overlay = $('#overlay'),
				send = $('#send'),
			messages = $('#messages'),
		users = $('#users');

		socket = io.connect(document.location.href);

		/* Logon */
		var logon = function(username, room)
		{
			socket.emit('C_SEND_NICK', {'nick': username});
			socket.emit('C_JOIN_ROOM', room);
		};

		/* Socket events */
		(function()
		{
			socket.on('S_SEND_ROOMLIST', function(data)
			{
				setRoomOptions(data);
			});

			socket.on('S_NEW_LINE', function(data)
			{
				addLine(data.user, data.timestamp, data.message, data.type);
			});

			socket.on('S_JOIN_ROOM', function(data)
			{
				setUserlist(data.userlist);
			});

			socket.on('S_SEND_USERLIST', function(data)
			{
				//console.log('Users: ' + data);
			});
		})();

		var setRoomOptions = function(rooms)
		{
			var select = $('#roomlist', overlay);

			for (i in rooms)
			{
				var room = rooms[i];

				$('<option />').val(room.id)
					.text(room.name).appendTo(select);
			}
		},

		setUserlist = function(usernames)
		{
			for (i in usernames)
			{
				addUser(usernames[i]);
			}
		},

		addUser = function(username)
		{
			$('<li />').html(username).appendTo(users);
		},

		addLine = function(username, timestamp, message, type)
		{
			var li = $('<li />');

			if (type == 'm')
			{
				li.html('&lt;' + username + '&gt; ' + message);
			}
			else if (type == 'j')
			{
				li.html('&lt;' + username + '&gt; ' + message);
			}
			else if (type == 'p')
			{
				li.html('&lt;' + username + '&gt; ' + message);
			}

			li.appendTo(messages);
		};

		/* Send */
		(function()
		{
			send.submit(function(e)
			{
				e.preventDefault();

				var input = $('input:first', send),
					message = $.trim(input.val());

				socket.emit('C_NEW_LINE', message);

				input.val('');
				input.focus();
			});
		})();

		/* Overlay */
		(function()
		{
			socket.emit('');

			$('form', overlay).submit(function(e)
			{
				e.preventDefault();

				logon(
					$('#username', overlay).val(),
					$('#roomlist', overlay).val()
				);

				overlay.fadeOut(400, function()
				{
					$('input:first', send).focus();
				});
			});
		})();

		$('input:first', overlay).focus();
	});
})(jQuery);