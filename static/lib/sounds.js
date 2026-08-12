'use strict';

/* globals config, app, socket, Audio, $, ajaxify, DOMParser */

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
			// Chat messages already get their own toast from the
			// event:chats.receive handler below — skip them here so a single
			// incoming message doesn't show two toasts
			const isChatNotification = data && (data.type === 'new-chat' || /^\/?chats\//.test(String(data.path || '')));
			if (data && !isChatNotification) {
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
				const isCurrentRoom = ajaxify.data && ajaxify.data.roomId && String(ajaxify.data.roomId) === String(data.roomId);
				if (!isCurrentRoom) {
					const message = data.message || {};
					const fromUser = message.fromUser || {};
					// message.content is parsed HTML; since NodeBB 4.13 the toast
					// template escapes non-token strings, so raw HTML shows up as
					// literal tags. Reduce it to plain text before displaying.
					// DOMParser neither runs scripts nor loads resources.
					let contentText;
					try {
						contentText = new DOMParser().parseFromString(message.content || '', 'text/html').body.textContent || '';
					} catch (e) {
						contentText = String(message.content || '').replace(/<[^>]*>/g, ' ');
					}
					alerts.alert({
						type: 'success',
						title: '[[modules:chat.user-has-messaged-you, ' + (fromUser.username || '') + ']]',
						message: contentText,
						timeout: 5000,
						clickfn: function () {
							ajaxify.go('chats/' + data.roomId);
						},
					});
				}
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
