let currentPage = 0;
let totalPage = 0;
let imageArray = [];

$(document).ready(function () {
    const boardJSON = JSON.parse(JSON.parse(document.getElementById('boardJSONString').textContent));
    totalPage = Object.keys(boardJSON).length;
    document.getElementById('currentPage').innerHTML = currentPage + 1;
    document.getElementById('totalPage').innerHTML = totalPage;

    let pageNumberInstance = 0; 
    Object.entries(boardJSON).map(([pageName, dataURL]) => {
        let imageInstance = document.createElement("img");
        imageInstance.src = dataURL;
        imageInstance.id =  "currentImage" + pageNumberInstance; pageNumberInstance++;
        imageArray.push(imageInstance);
    });    
    document.getElementById('board').appendChild(imageArray[currentPage]);
});

function exportBoard() {
    let image = imageArray[currentPage];
    let newTab = window.open("");
    newTab.document.write(image.outerHTML);
}

function previousPage() {
    if(currentPage >= 1){
        currentPage--;
        document.getElementById('currentPage').innerHTML = currentPage + 1;
        document.getElementById('board').removeChild(document.getElementById('board').firstChild);
        document.getElementById('board').appendChild(imageArray[currentPage]);
    }
}

function nextPage() {
    if(currentPage + 1 < totalPage){
        currentPage++;
        document.getElementById('currentPage').innerHTML = currentPage + 1;
        document.getElementById('board').removeChild(document.getElementById('board').firstChild);
        document.getElementById('board').appendChild(imageArray[currentPage]);
    }
}
