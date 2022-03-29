let page = 0; 

// setInterval(function () {
//     const roomName = JSON.parse(document.getElementById('room-name').textContent);
//     const canvas = document.getElementById("draw-canvas");    
//     const data = {
//         classroom: roomName,
//         board: canvas.toDataURL(),
//         page: page
//     };
    
//     const options = {
//         method: "POST",
//         headers: {'Content-Type': 'application/json'}, 
//         body: JSON.stringify(data) 
//     };

//     $.ajax({
//         method: 'POST',
//         url: `/sync_board/${roomName}`,
//         data: data
//     }).done(
//         function (data, statuyouts) {
//             console.log(data);
//         }
//     );
// }, 1000);    

$(document).ready ( function(){
   const boardJSON = JSON.parse(document.getElementById('boardJSONString').textContent);
   // console.log(boardJSON['page0']);
});


function exportBoard(){
   var canvas = document.getElementById("draw-canvas");
   var dataURL = canvas.toDataURL("image/png");
   var newTab = window.open('about:blank','image from canvas');
   newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
}