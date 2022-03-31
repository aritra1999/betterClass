function initDraw() {       
    window.addEventListener('resize', updateCanvas);
    document.querySelector('#draw-clear').onclick = function () { clearDraw(); }
    
    canvas = document.getElementById("currentCanvas" + currentPage);
    console.log(currentPage);
    ctx = canvas.getContext("2d");


    w = canvas.width;
    h = canvas.height;
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);


    function findxy(res, e) {
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            flag = true;
            dot_flag = true;
            if (dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = x;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;

                drawSocket.send(JSON.stringify({
                    'color': x,
                    'width': 2,
                    'x1': prevX,
                    'y1': prevY,
                    'x2': 2,
                    'y2': 2
                }));
            }
        }
        if (res == 'up' || res == "out") { flag = false; }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw();
            }
        }
    }

    function draw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    
        drawSocket.send(JSON.stringify({
            'color': x,
            'width': y,
            'x1': prevX,
            'y1': prevY,
            'x2': currX,
            'y2': currY
        }));
    }
    
    
    drawSocket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        let color = data['color'];
        let width = data['width'];
        let x1 = data['x1'];
        let y1 = data['y1'];
        let x2 = data['x2'];
        let y2 = data['y2'];
        let our_canvas = document.getElementById("currentCanvas" + currentPage);
        let ctx = our_canvas.getContext("2d");


        if (x1 == -1 && x2 == -1 && y1 == -1 && y2 == -1) {
            ctx.clearRect(0, 0, our_canvas.width, our_canvas.height);
        }
        if (x2 == 2 && y2 == 2) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(x1, y1, 2, 2);
            ctx.closePath();
            dot_flag = false;
        } else {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.closePath();
        }
    };
}
