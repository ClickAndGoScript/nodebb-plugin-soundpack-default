'use strict';

/* globals config, app, socket, Audio, $, ajaxify, utils */

require(['hooks', 'alerts'], function (hooks, alerts) {

	// NodeBB emits both `event:new_notification` and `event:chats.receive` for the
	// same incoming chat message in some cases (multi-tab sessions, join/leave races
	// around the socket room), and only one of them in others. Track which chat
	// messages already produced a toast so we show exactly one, regardless of which
	// event(s) actually arrive. The fingerprint includes the raw message content (not
	// just room+sender) so two distinct messages sent close together never collide.
	const recentChatToasts = {};
	const CHAT_TOAST_DEDUPE_WINDOW = 4000;
	const CHAT_NOTIFICATION_TYPES = ['new-chat', 'new-group-chat', 'new-public-chat'];

	function chatToastFingerprint(roomId, fromUid, rawContent) {
		return roomId + ':' + fromUid + ':' + (rawContent || '');
	}

	function claimChatToast(fingerprint) {
		const now = Date.now();
		Object.keys(recentChatToasts).forEach(function (k) {
			if (now - recentChatToasts[k] > CHAT_TOAST_DEDUPE_WINDOW) {
				delete recentChatToasts[k];
			}
		});
		const last = recentChatToasts[fingerprint];
		recentChatToasts[fingerprint] = now;
		return !last;
	}

	function toPlainText(rawContent) {
		return utils.stripHTMLTags(utils.decodeHTMLEntities(rawContent || ''));
	}

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
		socket.on('event:new_notification', function (payload) {
			if (config.notificationSound) {
				playAudio(config.notificationSound);
			}
			const data = payload && payload.notification;
			if (data) {
				const isChatNotification = CHAT_NOTIFICATION_TYPES.indexOf(data.type) !== -1;
				const isCurrentRoom = isChatNotification && ajaxify.data && ajaxify.data.roomId &&
					String(ajaxify.data.roomId) === String(data.roomId);
				const canShow = !isChatNotification || (!isCurrentRoom && claimChatToast(
					chatToastFingerprint(data.roomId, data.from, data.bodyLong)
				));
				if (canShow) {
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
			}
		});

		socket.on('event:chats.receive', function (data) {
			if (app.user && parseInt(data.fromUid, 10) !== parseInt(app.user.uid, 10)) {
				if (config.incomingChatSound) {
					playAudio(config.incomingChatSound);
				}
				const isCurrentRoom = ajaxify.data && ajaxify.data.roomId && String(ajaxify.data.roomId) === String(data.roomId);
				const message = data.message || {};
				if (!isCurrentRoom && claimChatToast(
					chatToastFingerprint(data.roomId, data.fromUid, message.content)
				)) {
					const fromUser = message.fromUser || {};
					alerts.alert({
						type: 'success',
						title: '[[modules:chat.user-has-messaged-you, ' + (fromUser.username || '') + ']]',
						message: toPlainText(message.content),
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
