<div class="mb-4">
    <label class="form-label fw-bold" for="notification">{{tx("sounds:notification-sound")}}</label>
    <div class="d-flex gap-2">
        <select class="form-select" id="notification" name="notification" data-property="notificationSound">
            <option value="">{{tx("sounds:no-sound")}}</option>
            {{{each notificationSound}}}
            <option value="{notificationSound.value}" {{{ if notificationSound.selected }}}selected{{{ end }}}>{notificationSound.name}</option>
            {{{end}}}
        </select>
        <button type="button" class="btn btn-outline-secondary" data-action="play">
            <i class="fa fa-play"></i>
        </button>
    </div>
</div>

{{{ if !config.disableChat }}}
<div class="mb-4">
    <label class="form-label fw-bold" for="chat-incoming">{{tx("sounds:incoming-message-sound")}}</label>
    <div class="d-flex gap-2">
        <select class="form-select" id="chat-incoming" name="chat-incoming" data-property="incomingChatSound">
            <option value="">{{tx("sounds:no-sound")}}</option>
            {{{each incomingChatSound}}}
            <option value="{incomingChatSound.value}" {{{ if incomingChatSound.selected }}}selected{{{ end }}}>{incomingChatSound.name}</option>
            {{{end}}}
        </select>
        <button type="button" class="btn btn-outline-secondary" data-action="play">
            <i class="fa fa-play"></i>
        </button>
    </div>
</div>

<div class="mb-4">
    <label class="form-label fw-bold" for="chat-outgoing">{{tx("sounds:outgoing-message-sound")}}</label>
    <div class="d-flex gap-2">
        <select class="form-select" id="chat-outgoing" name="chat-outgoing" data-property="outgoingChatSound">
            <option value="">{{tx("sounds:no-sound")}}</option>
            {{{each outgoingChatSound}}}
            <option value="{outgoingChatSound.value}" {{{ if outgoingChatSound.selected }}}selected{{{ end }}}>{outgoingChatSound.name}</option>
            {{{end}}}
        </select>
        <button type="button" class="btn btn-outline-secondary" data-action="play">
            <i class="fa fa-play"></i>
        </button>
    </div>
</div>
{{{ end }}}
