colors = ["Green", "Red", "Yellow", "White", "Black", "Blue"]

function copyClassCode() {
    navigator.clipboard.writeText(roomName);
    alert("Classroom code copied: " + roomName);
}

function exportBoard() {
    let canvas = document.getElementById("currentCanvas" + currentPage);
    let dataURL = canvas.toDataURL("image/png");
    let newTab = window.open('about:blank/Export Canvas', 'image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
}

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

function addPage() {
    totalPage++;
    currentPage = totalPage - 1;        
    document.getElementById('totalPage').innerHTML = totalPage;
    document.getElementById('currentPage').innerHTML =  totalPage;

    let canvasInstance = document.createElement("CANVAS");
    canvasInstance.width = 78 * window.innerWidth / 100;
    canvasInstance.height = 82 * window.innerHeight / 100 || 766;
    canvasInstance.id = "currentCanvas" + (totalPage - 1);
    canvasArray.push(canvasInstance);

    document.getElementById('board').removeChild(document.getElementById('board').firstChild);
    document.getElementById('board').appendChild(canvasArray[totalPage - 1]);
    initDraw();
    syncBoard();
}

function updateCanvas() {
    for(let updateCanvasInstance in canvasArray) {  
        updateCanvasInstance.width = 78 * window.innerWidth / 100;
        updateCanvasInstance.height = 82 * window.innerHeight / 100 || 766;
    }
}

function saveNote() {
    const note = $("#note").val();    
    const data = {
        note: note
    };

    $.ajax({ method: 'POST', url: `/sync_note/${roomName}`, data: data }).done(
        function (data, statuyouts) {
            console.log(data, statuyouts);
        }
    );
}

function syncBoard() {
    const canvas = document.getElementById("currentCanvas" + currentPage);    
    const data = {
        board: canvas.toDataURL(),
        page: currentPage
    };

    $.ajax({ method: 'POST', url: `/sync_board/${roomName}`, data: data }).done(
        function (data, statuyouts) {
            console.log(data, statuyouts);
        }
    );
}

function clearDraw() {
    if (confirm("Want to clear")) {
        let canvasInstance = document.getElementById("currentCanvas" + currentPage);
        let ctx = canvasInstance.getContext("2d");
        drawSocket.send(JSON.stringify({ 'color': x, 'width': y, 'x1': -1, 'y1': -1, 'x2': -1, 'y2': -1 }));
        ctx.clearRect(0, 0, canvasInstance.width, canvasInstance.height);
    }
}

function setActive(color) {
    for(let colorInstance in colors){
        $("#colorContainer" + colors[colorInstance]).removeClass('active');    
    }
    
    $("#colorContainer" + color.charAt(0).toUpperCase() + color.slice(1)).addClass('active');
}

function setColor(obj) {
    setActive(obj.id);
    switch (obj.id) {
        case "green": x = "green"; break;
        case "blue": x = "blue"; break;
        case "red": x = "red"; break;
        case "yellow": x = "yellow"; break;
        case "black": x = "black"; break;
        case "white": x = "white"; break;
    }
    if (x == "white") y = 20;
    else y = 2;
}


setInterval( syncBoard, 5000);
