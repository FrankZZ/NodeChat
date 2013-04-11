(function($)
{
	$(function()
	{
		var socket = null,
			username = null,
			overlay = $('#overlay'),
			send = $('#send'),
			messages = $('#messages'),
			content = $('.content'),
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

			socket.on('disconnect', function ()
			{
				window.setTimeout(function() { location.reload();}, 2000);
				//location.delay(2000).reload();
			});
		})();

		var setRoomOptions = function(rooms)
		{
			var select = $('#roomlist', overlay);

			for (var i in rooms)
			{
				var room = rooms[i];

				$('<option />').val(room.id)
					.text(room.name).appendTo(select);
			}
		},

		setUserlist = function(usernames)
		{
			for (var i in usernames)
			{
				addUser(usernames[i]);
			}
		},

		addUser = function(username)
		{
			$('<li />').html(username).attr('id', 'user' + username).appendTo(users);
		},

		delUser = function (username)
		{
			$('#user' + username).remove();
		},

		addLine = function(username, timestamp, message, type)
		{
			var li = $('<li />');

			if (type == 'm')
			{
				li.html(formatTime(new Date(timestamp * 1000)) + ' &lt;' + username + '&gt;: ' + message);
			}
			else if (type == 'j')
			{
				addUser(username);
				li.html(formatTime(new Date(timestamp * 1000)) + ' ' + username + ' joined').addClass('notice');
			}
			else if (type == 'p')
			{
				delUser(username);
				li.html(formatTime(new Date(timestamp * 1000)) + ' ' + username + ' left').addClass('notice');
			}

			li.appendTo(messages);

			content.stop();
			content.animate({scrollTop:messages.height()}, 'slow');

		},


		formatTime = function (time)
		{
			return '[' + zeroPad(time.getHours()) + ':' + zeroPad(time.getMinutes()) + ':' + zeroPad(time.getSeconds()) + ']';
		},

		zeroPad = function (number)
		{
			if (number <= 9)
			{
				return '0' + number;
			}
			return '' + number;
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