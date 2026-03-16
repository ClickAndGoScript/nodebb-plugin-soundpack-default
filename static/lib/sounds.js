'use strict';

/* globals config, app, socket, Audio, $, ajaxify */

require(['hooks', 'alerts'], function (hooks, alerts) {

    // פונקציה להשמעת צליל
    function playAudio(file) {
        if (!file) return;
        const soundUrl = config.relative_path + '/assets/plugins/nodebb-plugin-soundpack-default/sounds/' + file;
        const audio = new Audio(soundUrl);
        audio.play().catch(function (err) {
            console.warn('[soundpack] Playback blocked:', err);
        });
    }

    // פונקציה להצגת הודעת טוסט
    function showToast(data) {
        alerts.alert({
            type: 'info',
            title: data.title || 'התראה חדשה',
            message: data.bodyShort || data.text || 'קיבלת עדכון חדש בפורום',
            timeout: 5000, // יוצג ל-5 שניות
            clickfn: function() {
                if (data.path) ajaxify.go(data.path);
            }
        });
    }

    // מאזין לכפתורי בדיקת צליל בהגדרות
    $(document).on('click', 'button[data-action="play"]', function (e) {
        e.preventDefault();
        const select = $(this).closest('.d-flex').find('select');
        const soundFile = select.val();
        if (soundFile) {
            playAudio(soundFile);
        }
    });

    // הרצת מאזינים רק פעם אחת
    if (!window.soundpackInitialized) {
        
        // 1. טיפול בהתראות כלליות (לייקים, תיוגים, תגובות)
        socket.on('event:new_notification', function (data) {
            if (config.notificationSound) {
                playAudio(config.notificationSound);
            }
            // הצגת הטוסט
            if (data) {
                showToast({
                    title: '[[global:notification]]',
                    bodyShort: data.bodyShort,
                    path: data.path
                });
            }
        });

        // 2. טיפול בהודעות צ'אט נכנסות
        socket.on('event:chats.receive', function (data) {
            if (app.user && parseInt(data.fromUid, 10) !== parseInt(app.user.uid, 10)) {
                if (config.incomingChatSound) {
                    playAudio(config.incomingChatSound);
                }
                // הצגת טוסט עבור צ'אט
                alerts.alert({
                    type: 'success',
                    title: 'הודעה מ- ' + (data.fromUser ? data.fromUser.username : 'משתמש'),
                    message: data.content,
                    timeout: 5000,
                    clickfn: function() {
                        ajaxify.go('/roomId/' + data.roomId);
                    }
                });
            }
        });

        // 3. צליל בלבד לשליחת צ'אט (אין צורך בטוסט לעצמך)
        hooks.on('action:chat.sent', function () {
            if (config.outgoingChatSound) {
                playAudio(config.outgoingChatSound);
            }
        });

        window.soundpackInitialized = true;
    }
});