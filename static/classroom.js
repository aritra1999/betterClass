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
    }else if(data.meta == 'new_user'){
        document.querySelector('#chat-log').innerHTML += `
        <div class="m-2 px-2 text-green-500 text-sm">
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

function copyClassCode() {
    var copyText = document.getElementById("classCode");
    copyText.select();
    copyText.setSelectionRange(0, 99999); 

    navigator.clipboard.writeText(copyText.value);
    alert("Classroom code copied: " + copyText.value);
}


// dragElement(document.getElementById("toolbar"));

// function dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   if (document.getElementById(elmnt.id + "header")) {
//     // if present, the header is where you move the DIV from:
//     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//   } else {
//     // otherwise, move the DIV from anywhere inside the DIV:
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//   }

//   function closeDragElement() {
//     // stop moving when mouse button is released:
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }