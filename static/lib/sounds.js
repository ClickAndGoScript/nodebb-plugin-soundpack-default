'use strict';

/* globals config, app, socket, Audio, $, ajaxify */

require(['hooks', 'alerts'], function (hooks, alerts) {

	function playAudio(file) {
		if (!file) return;
		const soundUrl = config.relative_path + '/assets/plugins/nodebb-plugin-soundpack-default/sounds/' + file;
		const audio = new Audio(soundUrl);
		audio.play().catch(function (err) {
			console.warn('[soundpack] Playback blocked:', err);
		});
	}

	$(document).on('click', 'button[data-action="play"]', function (e) {
		e.preventDefault();
		const select = $(this).closest('.d-flex').find('select');
		const soundFile = select.val();
		if (soundFile) {
			playAudio(soundFile);
		}
	});

	if (!window.soundpackInitialized) {
		socket.on('event:new_notification', function (data) {
			if (config.notificationSound) {
				playAudio(config.notificationSound);
			}
			if (data) {
				alerts.alert({
					type: 'info',
					title: '[[sounds:new-notification-title]]',
					message: data.bodyShort || '',
					timeout: 5000,
					clickfn: function () {
						if (data.path) ajaxify.go(data.path);
					},
				});
			}
		});

		socket.on('event:chats.receive', function (data) {
			if (app.user && parseInt(data.fromUid, 10) !== parseInt(app.user.uid, 10)) {
				if (config.incomingChatSound) {
					playAudio(config.incomingChatSound);
				}
				const username = (data.fromUser && data.fromUser.username) ? data.fromUser.username : '';
				alerts.alert({
					type: 'success',
					title: '[[modules:chat.user-has-messaged-you, ' + username + ']]',
					message: data.message ? data.message.content : '',
					timeout: 5000,
					clickfn: function () {
						ajaxify.go('chats/' + data.roomId);
					},
				});
			}
		});

		hooks.on('action:chat.sent', function () {
			if (config.outgoingChatSound) {
				playAudio(config.outgoingChatSound);
			}
		});

		window.soundpackInitialized = true;
	}
});
