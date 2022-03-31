const roomName = JSON.parse(document.getElementById('room-name').textContent);
const userUsername = JSON.parse(document.getElementById('user-name').textContent);
const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + roomName + '/');
const drawSocket = new WebSocket('ws://' + window.location.host + '/ws/drawshare/' + roomName + '/');
const user = JSON.parse(document.getElementById('user-name').textContent);
const teacher = JSON.parse(document.getElementById('teacher').textContent);

let currentPage = 0;
let totalPage = 0;
let canvasArray = [];

let canvas, ctx, flag = false, prevX = 0, currX = 0, prevY = 0, currY = 0, dot_flag = false;
let x = "black", y = 2;

function setup() {
    return {
        activeTab: 0,
        tabs: [
            "Messages",
            "Notes",
            "Participants"  
        ]
    };
};

function updateCanvas() {
    for(let updateCanvasInstance in canvasArray) {  
        updateCanvasInstance.width = 78 * window.innerWidth / 100;
        updateCanvasInstance.height = 82 * window.innerHeight / 100 || 766;
    }
}


function clearDraw() {
    var m = confirm("Want to clear");
    if (m) {
        let our_canvas = document.getElementById("currentCanvas" + currentPage);
        let ctx = our_canvas.getContext("2d");
        drawSocket.send(JSON.stringify({
            'color': x,
            'width': y,
            'x1': -1,
            'y1': -1,
            'x2': -1,
            'y2': -1
        }));
        ctx.clearRect(0, 0, our_canvas.width, our_canvas.height);
    }
}

function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 20;
    else y = 2;
}
