<label class="form-label" for="notification">[[sounds:notification-sound]]</label>
<div class="d-flex gap-2 mb-3">
    <select class="form-select" id="notification" name="notification" data-property="notificationSound">
        <option value="">[[sounds:no-sound]]</option>
        {{{each notificationSound}}}
        <option value="{notificationSound.value}" {{{ if notificationSound.selected }}}selected{{{ end }}}>{notificationSound.name}</option>
        {{{end}}}
    </select>
    <button type="button" class="btn btn-outline-secondary" data-action="play">
        <span class="d-none d-sm-inline">[[global:play]] </span><i class="fa fa-play"></i>
    </button>
</div>

{{{ if !config.disableChat }}}
<label class="form-label" for="chat-incoming">[[sounds:incoming-message-sound]]</label>
<div class="d-flex gap-2 mb-3">
    <select class="form-select" id="chat-incoming" name="chat-incoming" data-property="incomingChatSound">
        <option value="">[[sounds:no-sound]]</option>
        {{{each incomingChatSound}}}
        <option value="{incomingChatSound.value}" {{{ if incomingChatSound.selected }}}selected{{{ end }}}>{incomingChatSound.name}</option>
        {{{end}}}
    </select>
    <button type="button" class="btn btn-outline-secondary" data-action="play">
        <span class="d-none d-sm-inline">[[global:play]] </span><i class="fa fa-play"></i>
    </button>
</div>

<label class="form-label" for="chat-outgoing">[[sounds:outgoing-message-sound]]</label>
<div class="d-flex gap-2 mb-3">
    <select class="form-select" id="chat-outgoing" name="chat-outgoing" data-property="outgoingChatSound">
        <option value="">[[sounds:no-sound]]</option>
        {{{each outgoingChatSound}}}
        <option value="{outgoingChatSound.value}" {{{ if outgoingChatSound.selected }}}selected{{{ end }}}>{outgoingChatSound.name}</option>
        {{{end}}}
    </select>
    <button type="button" class="btn btn-outline-secondary" data-action="play">
        <span class="d-none d-sm-inline">[[global:play]] </span><i class="fa fa-play"></i>
    </button>
</div>
{{{ end }}}