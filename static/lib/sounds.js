'use strict';

/* globals config, app, socket, Audio, $ */

// נשתמש ב-requirejs כדי להבטיח תאימות למערכת המודולים של NodeBB
require(['hooks'], function (hooks) {

    function playAudio(file) {
        if (!file) return;

        // נתיב הנכסים ב-NodeBB 4.x
        const soundUrl = config.relative_path + '/assets/plugins/nodebb-plugin-soundpack-default/sounds/' + file;
        const audio = new Audio(soundUrl);
        
        audio.play().catch(function (err) {
            console.warn('[soundpack] Playback failed. User might need to interact with the page first.', err);
        });
    }

    // מאזין גלובלי לכפתורי הנגינה - עובד גם אחרי מעבר דפים (Ajaxify)
    $(document).on('click', 'button[data-action="play"]', function (e) {
        e.preventDefault();
        // מוצאים את ה-select שנמצא באותו קונטיינר של הכפתור שלחצנו עליו
        const select = $(this).closest('.d-flex').find('select');
        const soundFile = select.val();
        
        if (soundFile) {
            playAudio(soundFile);
        }
    });

    // רישום לאירועי שרת (רק פעם אחת בטעינת האתר)
    if (!window.soundpackInitialized) {
        
        socket.on('event:new_notification', function () {
            if (config.notificationSound) {
                playAudio(config.notificationSound);
            }
        });

        socket.on('event:chats.receive', function (data) {
            if (app.user && parseInt(data.fromUid, 10) !== parseInt(app.user.uid, 10)) {
                if (config.incomingChatSound) {
                    playAudio(config.incomingChatSound);
                }
            }
        });

        // אירוע שליחת צ'אט (צד לקוח)
        hooks.on('action:chat.sent', function () {
            if (config.outgoingChatSound) {
                playAudio(config.outgoingChatSound);
            }
        });

        window.soundpackInitialized = true;
    }
});