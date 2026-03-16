'use strict';

const user = require.main.require('./src/user');

const plugin = module.exports;
let app;

plugin.init = async (hookData) => {
	app = hookData.app;
	return hookData;
};

plugin.filterConfigGet = async (config) => {
	const userSettings = await user.getSettings(config.uid);
	config.notificationSound = userSettings.notificationSound || '';
	config.incomingChatSound = userSettings.incomingChatSound || '';
	config.outgoingChatSound = userSettings.outgoingChatSound || '';
	return config;
};

plugin.filterUserSaveSettings = async (hookData) => {
	if (hookData.data) {
		hookData.settings.notificationSound = hookData.data.notificationSound;
		hookData.settings.incomingChatSound = hookData.data.incomingChatSound;
		hookData.settings.outgoingChatSound = hookData.data.outgoingChatSound;
	}
	return hookData;
};

plugin.filterUserCustomSettings = async (hookData) => {
	const userSettings = await user.getSettings(hookData.uid);

	const soundsMap = {
		'Deedle-dum': 'notification.mp3',
		'Water drop (high)': 'waterdrop-high.mp3',
		'Water drop (low)': 'waterdrop-low.mp3',
	};

	function getOptions(type) {
		return Object.keys(soundsMap).map(function (name) {
			return {
				name: name,
				value: soundsMap[name],
				selected: userSettings[type] === soundsMap[name],
			};
		});
	}

	const tplData = {
		notificationSound: getOptions('notificationSound'),
		incomingChatSound: getOptions('incomingChatSound'),
		outgoingChatSound: getOptions('outgoingChatSound'),
		config: {
			disableChat: hookData.disableChat || false
		}
	};

	const settingsHtml = await app.renderAsync('partials/account/settings/sounds', tplData);

	hookData.customSettings.push({
		title: '[[sounds:sounds]]',
		content: settingsHtml,
	});

	return hookData;
};