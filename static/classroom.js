function copyClassCode() {
    navigator.clipboard.writeText(roomName);
    alert("Classroom code copied: " + roomName);
}

function exportBoard() {
    var canvas = document.getElementById("currentCanvas");
    var dataURL = canvas.toDataURL("image/png");
    var newTab = window.open('about:blank', 'image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
}

$(document).ready(function () {
    const boardJSON = JSON.parse(JSON.parse(document.getElementById('boardJSONString').textContent));
    
    totalPage = Object.keys(boardJSON).length;
    document.getElementById('currentPage').innerHTML = currentPage + 1;
    document.getElementById('totalPage').innerHTML = totalPage;

    if(totalPage == 0){
        let canvasInstance = document.createElement("CANVAS");
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
            // canvasInstance.id = "page" + pageNumberInstance; pageNumberInstance++;
            canvasInstance.id = "currentCanvas" + pageNumberInstance; pageNumberInstance++;
            var img = new Image;
            img.onload = function(){
                ctx.drawImage(img,0,0); 
            };
            img.src = dataURL;
            canvasArray.push(canvasInstance);
        });
    }
    document.getElementById('board').appendChild(canvasArray[currentPage]);
    initDraw();
});

function previousPage() {
    if(currentPage >= 1){
        currentPage--;
        document.getElementById('currentPage').innerHTML = currentPage + 1;
        document.getElementById('board').removeChild(document.getElementById('board').firstChild);
        document.getElementById('board').appendChild(canvasArray[currentPage]);
        initDraw();
        syncBoard();
    }
}

function nextPage() {
    if(currentPage + 1 < totalPage){
        currentPage++;
        document.getElementById('currentPage').innerHTML = currentPage + 1;
        document.getElementById('board').removeChild(document.getElementById('board').firstChild);
        document.getElementById('board').appendChild(canvasArray[currentPage]);
        initDraw();
        syncBoard();
    }
}

function syncBoard() {
    const roomName = JSON.parse(document.getElementById('room-name').textContent);
    const canvas = document.getElementById("currentCanvas" + currentPage);    
    const data = {
        classroom: roomName,
        board: canvas.toDataURL(),
        page: currentPage
    };

    $.ajax({ method: 'POST', url: `/sync_board/${roomName}`, data: data }).done(
        function (data, statuyouts) {
            console.log(data, statuyouts);
        }
    );
}

function addPage() {
    totalPage++;
    currentPage = totalPage - 1;        
    document.getElementById('totalPage').innerHTML = totalPage;
    document.getElementById('currentPage').innerHTML =  totalPage;

    let canvasInstance = document.createElement("CANVAS");
    canvasInstance.width = 78 * window.innerWidth / 100;
    canvasInstance.height = 82 * window.innerHeight / 100 || 766;
    canvasInstance.style.width = 78 * window.innerWidth / 100;
    canvasInstance.style.height = 82 * window.innerHeight / 100 || 766;
    canvasInstance.id = "currentCanvas" + (totalPage - 1);
    canvasArray.push(canvasInstance);

    document.getElementById('board').removeChild(document.getElementById('board').firstChild);
    document.getElementById('board').appendChild(canvasArray[totalPage - 1]);
    initDraw();
    syncBoard();
}

setInterval( syncBoard, 5000);

/*
// Make Toolbar dragable 
dragElement(document.getElementById("toolbar"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

*/
