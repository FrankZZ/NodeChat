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
				console.log(data);
			});

			socket.on('S_JOIN_ROOM', function(data)
			{
				//console.log(data);
			});

			socket.on('S_SEND_USERLIST', function(data)
			{
				console.log('Users: ' + data);
			});
		})();

		/* Send */
		(function()
		{
			send.submit(function(e)
			{
				e.preventDefault();

				var input = $('input:first', send),
					message = $.trim(input.val());

				addMessage(username, message);

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
					$('#room', overlay).val()
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