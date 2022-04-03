const roomName = JSON.parse(document.getElementById('room-name').textContent);
const userUsername = JSON.parse(document.getElementById('user-name').textContent);
const user = JSON.parse(document.getElementById('user-name').textContent);
const teacher = JSON.parse(document.getElementById('teacher').textContent);

const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + roomName + '/');
const drawSocket = new WebSocket('ws://' + window.location.host + '/ws/drawshare/' + roomName + '/');

let currentPage = 0;
let totalPage = 0;
let canvasArray = [];
let canvas, ctx, flag = false, prevX = 0, currX = 0, prevY = 0, currY = 0, dot_flag = false;
let x = "black", y = 2;

function setup() {
    return {activeTab: 0, tabs: [ "Messages", "Notes", "Participants"]};
};

$(document).ready(function () {
    const boardJSON = JSON.parse(JSON.parse(document.getElementById('boardJSONString').textContent));
    totalPage = Object.keys(boardJSON).length;
    document.getElementById('currentPage').innerHTML = currentPage + 1;
    document.getElementById('totalPage').innerHTML = totalPage;

    if(totalPage == 0){
        let canvasInstance = document.createElement("CANVAS");
        totalPage++;    
        document.getElementById('totalPage').innerHTML = totalPage;
        canvasInstance.width = 78 * window.innerWidth / 100;
        canvasInstance.height = 82 * window.innerHeight / 100 || 766;
        canvasInstance.style.width = 78 * window.innerWidth / 100;
        canvasInstance.style.height = 82 * window.innerHeight / 100 || 766;
        canvasInstance.id = "currentCanvas0";
        canvasArray.push(canvasInstance);
    } else {
        let pageNumberInstance = 0; 
        Object.entries(boardJSON).map(([pageName, dataURL]) => {
            let canvasInstance = document.createElement("CANVAS");
            let ctx = canvasInstance.getContext('2d');
            canvasInstance.width = 78 * window.innerWidth / 100;
            canvasInstance.height = 82 * window.innerHeight / 100 || 766;
            canvasInstance.style.width = 78 * window.innerWidth / 100;
            canvasInstance.style.height = 82 * window.innerHeight / 100 || 766;
            canvasInstance.id = "currentCanvas" + pageNumberInstance; pageNumberInstance++;

            let img = new Image;
            img.onload = function(){ ctx.drawImage(img,0,0); };
            img.src = dataURL;
            
            canvasArray.push(canvasInstance);
        });
    }
    document.getElementById('board').appendChild(canvasArray[currentPage]);
    initDraw();
});

