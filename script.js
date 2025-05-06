let curGoodTile;
let curBadTile;
let speed = 20;
let tilesShown = 0;
let score = 0;
let gameOver = false;
let clicked = false;

window.onload = function() {
    prepGame();
}

function prepGame() {
    for (let i = 0; i < 25; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    changeTileTimeout();
}

function getRandomNum(r) {
    let num = Math.floor(Math.random() * r);
    return num.toString();
}

function setGoodTile() {
    if (curGoodTile) {
        curGoodTile.innerHTML = "";
    }
    
    let goodTile = document.createElement("img");
    goodTile.src = "good-tile.png";

    let num = getRandomNum(15);
    while (curBadTile && curBadTile.id === num) {
        num = getRandomNum(15);
    }
    curGoodTile = document.getElementById(num);
    curGoodTile.appendChild(goodTile);
    
    tilesShown++;
    changeTileTimeout();
}

function setBadTile() {
    if (curBadTile) {
        curBadTile.innerHTML = "";
    }
    
    let badTile = document.createElement("img");
    badTile.src = "bad-tile.png";
    
    let num = getRandomNum(15);
    while (curGoodTile && curGoodTile.id === num) {
        num = getRandomNum(15);
    }
    curBadTile = document.getElementById(num);
    curBadTile.appendChild(badTile);
    
    clicked = false;
}

function changeTileTimeout(f) {
    if (gameOver) {
        return;
    }
    
    let t;
    if (tilesShown % 10 === 0 && speed > 8) {
        speed -= 2;
    }
    
    t = getRandomNum(speed) * 100;
    while (t < (speed * 100)/4) {
        t = getRandomNum(speed) * 100;
    }
    setTimeout(setGoodTile, t);
    setTimeout(setBadTile, t);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this === curGoodTile && !clicked) {
        score++;
        clicked = true;
        document.getElementById("score").innerHTML = score.toString();
    }
    else if (this === curBadTile) {
        document.getElementById("score").innerText = "The world is plunged into darkness after " + score + " successful charge(s)";
        clearTimeout(setGoodTile);
        clearTimeout(setBadTile);
        gameOver = true;
    }
}