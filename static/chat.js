function getTime() {
    const d = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const ampm = d.getHours() >= 12 ? 'pm' : 'am';
    return months[d.getMonth()] + ". " + d.getDate() + ", " + d.getFullYear() + ", " + (d.getHours() % 12 == 0 ? 12 : d.getHours()) + ":" + d.getMinutes() + " " + ampm;
}

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (data.meta == 'new_message') {
        document.querySelector('#chat-log').innerHTML += `
        <div class="message px-4 py-2">
            <div class="flex justify-between">
                <div class="text-slate-600 text-xs mb-0.5">
                    <small>
                    ` + data.username + `
                    </small>
                </div>
                <div class="text-slate-400 text-xs ">
                    <small>
                    ` + getTime() + `
                    </small>
                </div>
            </div>
            <div class="py-2 px-4 rounded-bl-lg rounded-br-lg rounded-tr-lg  bg-blue-600 text-white max-w-max">
                ` + data.message + `   
            </div>
        </div>
        `;
        var elem = document.getElementById('chat-log');
        elem.scrollTop = elem.scrollHeight;
    } else if (data.meta == 'new_user') {
        document.querySelector('#chat-log').innerHTML += `
        <div class="m-2 px-2 text-green-500 text-sm">
            ` + data.new_user + ` has joined the classroom.  
        </div>
        `;
        document.querySelector('#participants').innerHTML = "";
        for (var user in data.user_list) {
            document.querySelector('#participants').innerHTML += `
                <div class="py-2 px-4">
                    ` + data.user_list[user] + `
                </div>
            `;

        }
        document.querySelector('#user-count').innerHTML = data.user_list.length;
    } else if (data.meta == 'user_disconnect') {

        document.querySelector('#user-count').innerHTML = parseInt(document.querySelector('#user-count').innerHTML) - 1;
        document.querySelector('#chat-log').innerHTML += `
        <div class=" m-2 px-2 text-red-500 text-sm">
            ` + data.new_user + ` has left the classroom.  
        </div>
        `;
    }
};


chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};


document.querySelector('#chat-message-submit').onclick = function (e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    if (message.length > 0) {
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': userUsername,
        }));
        messageInputDom.value = '';
    }
};
