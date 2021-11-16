const roomName = JSON.parse(document.getElementById('room-name').textContent);
const user_username = JSON.parse(document.getElementById('user-name').textContent);

function getTime(){
    const d = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const ampm = d.getHours() >= 12 ? 'pm' : 'am';
    return months[d.getMonth()] + ". " + d.getDate() + ", " + d.getFullYear() + ", " + (d.getHours()%12 == 0?12 : d.getHours()) + ":" + d.getMinutes() + " " + ampm;
}

const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + roomName + '/');

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if(data.meta == 'new_message'){
        document.querySelector('#chat-log').innerHTML += `
        <div class="message border-b border-gray-300 m-2 px-2 py-3">
            <div class="text-xs mb-2 flex justify-between">
                <div class="text-gray-700 font-bold">
                    ` + data.username + `
                </div>
                <div class="text-gray-500">
                    ` + getTime() + `
                </div>
            </div>
            ` + data.message + `   
        </div>
        `;
    }else if(data.meta == 'new_user'){
        document.querySelector('#chat-log').innerHTML += `
        <div class=" border-b border-gray-300 m-2 px-2 pb-3 text-green-500 font-bold">
            ` + data.new_user + ` has joined the classroom.  
        </div>
        `;
        document.querySelector('#participants').innerHTML = "";
        for(var user in data.user_list){
            document.querySelector('#participants').innerHTML += `
                <div class="py-2 px-4">
                    ` + data.user_list[user] + `
                </div>
            `;
            
        }
        document.querySelector('#user-count').innerHTML = data.user_list.length;
    }else if(data.meta == 'user_disconnect'){

        document.querySelector('#user-count').innerHTML = parseInt(document.querySelector('#user-count').innerHTML) - 1;
        document.querySelector('#chat-log').innerHTML += `
        <div class="border-b border-gray-300 m-2 px-2 pb-3 text-red-500 font-bold">
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
            'username': user_username,
        }));
        messageInputDom.value = '';
    }
};


function setup() {
    return {
        activeTab: 0,
        tabs: [
            "Messages",
            "Participants",
        ]
    };
};

