'use strict';

/* globals config, app, socket, Audio */

// שימוש ב-RequireJS של NodeBB כדי להבטיח טעינה תקינה
require(['hooks', 'ajaxify'], function (hooks, ajaxify) {
    const cache = {};

    function playAudio(file) {
        if (!file) return;

        // נתיב מעודכן לנכסים בגרסה 4
        const path = config.relative_path + '/assets/plugins/nodebb-plugin-soundpack-default/assets/sounds/' + file;
        
        if (!cache[file]) {
            cache[file] = new Audio(path);
        }
        
        const audio = cache[file];
        audio.pause();
        audio.currentTime = 0;
        
        // בדפדפנים מודרניים play מחזיר Promise
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(function(e) {
                console.warn('[soundpack] השמעת צליל נחסמה על ידי הדפדפן או שהקובץ חסר:', e);
            });
        }
    }

    // צליל התראה חדשה
    socket.on('event:new_notification', function () {
        if (config.notificationSound) {
            playAudio(config.notificationSound);
        }
    });

    // צליל הודעת צ'אט נכנסת
    socket.on('event:chats.receive', function (data) {
        if (parseInt(data.fromUid, 10) !== parseInt(app.user.uid, 10)) {
            if (config.incomingChatSound) {
                playAudio(config.incomingChatSound);
            }
        }
    });

    // צליל הודעת צ'אט ששלחתי
    hooks.on('action:chat.sent', function () {
        if (config.outgoingChatSound) {
            playAudio(config.outgoingChatSound);
        }
    });

    // כפתורי "נגן" בדף ההגדרות
    hooks.on('action:ajaxify.end', function (data) {
        if (data.tpl_name === 'account/settings') {
            const container = document.querySelector('.account');
            if (container) {
                container.addEventListener('click', function (e) {
                    const btn = e.target.closest('button[data-action="play"]');
                    if (btn) {
                        e.preventDefault();
                        const select = btn.closest('.d-flex').querySelector('select');
                        playAudio(select.value);
                    }
                });
            }
        }
    });
});