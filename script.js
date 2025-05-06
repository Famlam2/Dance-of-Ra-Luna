let curSunTile;
let curMoonTile;
let speed = 20;
let tilesShown = 0;
let tilesSinceClick = 0;
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
    setTimeout(changeTileTimeout, 7500);
}

function getRandomNum(r) {
    let num = Math.floor(Math.random() * r);
    return num.toString();
}

function setSunTile() {
    if (gameOver) {
        return;
    }
    
    if (curSunTile) {
        curSunTile.innerHTML = "";
    }
    
    let sunTile = document.createElement("img");
    sunTile.src = "good-tile.png";
    let num = getRandomNum(15);
    while (curMoonTile && curMoonTile.id === num) {
        num = getRandomNum(15);
    }
    
    curSunTile = document.getElementById(num);
    curSunTile.appendChild(sunTile);
    tilesShown++;
    tilesSinceClick++;
    clicked = false;
    changeTileTimeout();
}

function setBadTile() {
    if (gameOver) {
        return;
    }
    
    if (curMoonTile) {
        curMoonTile.innerHTML = "";
    }
    
    let moonTile = document.createElement("img");
    moonTile.src = "bad-tile.png";
    let num = getRandomNum(15);
    while (curSunTile && curSunTile.id === num) {
        num = getRandomNum(15);
    }
    
    curMoonTile = document.getElementById(num);
    curMoonTile.appendChild(moonTile);
}

function changeTileTimeout() {
    if (tilesSinceClick >= 5) {
        document.getElementById("score").innerText = "The world is plunged into darkness after " + score + " successful charge(s).\nClick on the sun to retry.";
        gameOver = true;
    }
    
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
    setTimeout(setSunTile, t);
    setTimeout(setBadTile, t);
}

function selectTile() {
    if (this === curSunTile && gameOver) {
        curSunTile.innerHTML = "";
        curMoonTile.innerHTML = "";
        speed = 20;
        tilesShown = 0;
        tilesSinceClick = 0;
        score = -1;    // Otherwise it starts with a score of 1
        gameOver = false;
        clicked = false;
        changeTileTimeout();
        document.getElementById("score").innerText = "Charges: 0";
    }
    
    if (gameOver) {
        return;
    }
    if (this === curSunTile && !clicked) {
        score++;
        clicked = true;
        tilesSinceClick = 0;
        document.getElementById("score").innerHTML = "Charges: " + score.toString();
    }
    else if (this === curMoonTile) {
        document.getElementById("score").innerText = "The world is plunged into darkness after " + score + " successful charge(s).\nClick the sun to retry.";
        gameOver = true;
    }
}