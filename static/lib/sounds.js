'use strict';

/* globals config, app, socket, Audio */

(function () {
    // פונקציית עזר להשמעת צליל
    function playAudio(file) {
        if (!file) return;

        // נתיב מעודכן לפי ההגדרה החדשה ב-plugin.json
        const soundUrl = config.relative_path + '/assets/plugins/nodebb-plugin-soundpack-default/sounds/' + file;
        
        const audio = new Audio(soundUrl);
        
        audio.play().catch(function (err) {
            // דפדפנים חוסמים אודיו אם המשתמש לא לחץ על כלום בדף עדיין
            console.warn('[soundpack] Playback blocked or file missing:', err);
        });
    }

    // המתנה לטעינת המערכת
    $(window).on('action:app.load', function () {
        
        // צליל התראה
        socket.on('event:new_notification', function () {
            if (config.notificationSound) {
                playAudio(config.notificationSound);
            }
        });

        // צליל הודעה נכנסת
        socket.on('event:chats.receive', function (data) {
            if (app.user && parseInt(data.fromUid, 10) !== parseInt(app.user.uid, 10)) {
                if (config.incomingChatSound) {
                    playAudio(config.incomingChatSound);
                }
            }
        });

        // צליל הודעה יוצאת
        $(window).on('action:chat.sent', function () {
            if (config.outgoingChatSound) {
                playAudio(config.outgoingChatSound);
            }
        });

        // טיפול בכפתורי בדיקה (Play) בדף ההגדרות
        $(window).on('action:ajaxify.end', function (ev, data) {
            if (data.tpl_name === 'account/settings') {
                $('.account').on('click', 'button[data-action="play"]', function (e) {
                    e.preventDefault();
                    const soundFile = $(this).closest('.d-flex').find('select').val();
                    if (soundFile) {
                        playAudio(soundFile);
                    } else {
                        app.alertError('אנא בחר צליל לבדיקה');
                    }
                });
            }
        });
    });
}());