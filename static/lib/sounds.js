'use strict';

/* globals config, app, socket, Audio */

import { on } from 'hooks';

// שמירת זיכרון לצלילים שכבר נטענו
const cache = {};

function playAudio(file) {
    if (!file) return;

    const path = config.relative_path + '/assets/plugins/nodebb-plugin-soundpack-default/assets/sounds/' + file;
    
    if (!cache[file]) {
        cache[file] = new Audio(path);
    }
    
    const audio = cache[file];
    audio.pause();
    audio.currentTime = 0;
    
    audio.play().catch(e => console.error('[soundpack] Playback failed:', e));
}

// האזנה לאירועים
on('static:init', () => {
    socket.on('event:new_notification', () => {
        playAudio(config.notificationSound);
    });

    socket.on('event:chats.receive', (data) => {
        if (parseInt(data.fromUid, 10) !== parseInt(app.user.uid, 10)) {
            playAudio(config.incomingChatSound);
        }
    });

    on('action:chat.sent', () => {
        playAudio(config.outgoingChatSound);
    });

    on('action:ajaxify.end', (data) => {
        if (data.tpl_name === 'account/settings') {
            const container = document.querySelector('.account');
            if (container) {
                container.querySelectorAll('button[data-action="play"]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const select = btn.closest('.d-flex').querySelector('select');
                        playAudio(select.value);
                    });
                });
            }
        }
    });
});