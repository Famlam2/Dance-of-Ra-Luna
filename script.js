// TODO: Snail sounds, aesthetic finalisation

let curSunTile;
let curMoonTile;
let curSnailTile;
let speed = 20;
let tilesShown = 0;
let tilesSinceClick = 0;
let score = 0;
let initialGameStarted = false;
let gameOver = false;
let sunClicked = false;
let snailClicked = false;
let chargeAudio = new Audio("SFX/charge.mp3");
chargeAudio.preload = "auto";
let loseAudio = new Audio("SFX/lose.mp3");
loseAudio.preload = "auto";
let slowDownAudio = new Audio("SFX/slow down.mp3");
slowDownAudio.preload = "auto";
let cancelAudio = new Audio("SFX/cancel.mp3");
cancelAudio.preload = "auto";

window.onload = function() {
    prepGame();
}

function prepGame() {
    chargeAudio.load();
    loseAudio.load();
    slowDownAudio.load();
    cancelAudio.load();
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

function setSunTile() {
    if (gameOver) {
        return;
    }
    
    if (curSunTile) {
        curSunTile.innerHTML = "";
        curSunTile.style.boxShadow = "none";
    }
    
    let sunTile = document.createElement("img");
    sunTile.src = "Sprites/sol.png";
    let num = getRandomNum(15);
    while ((curMoonTile && curMoonTile.id === num) || (curSunTile && curSunTile.id === num) || (curSnailTile && curSnailTile.id === num)) {
        num = getRandomNum(15);
    }
    
    curSunTile = document.getElementById(num);
    curSunTile.appendChild(sunTile);
    if (initialGameStarted) {
        tilesShown++;
        tilesSinceClick++;
        sunClicked = false;
        changeTileTimeout();
    }
}

function setMoonTile() {
    if (gameOver) {
        return;
    }

    if (curMoonTile) {
        curMoonTile.innerHTML = "";
    }
    
    let moonTile = document.createElement("img");
    moonTile.src = "Sprites/hecate.png";
    let num = getRandomNum(15);
    while ((curSunTile && curSunTile.id === num) || (curMoonTile && curMoonTile.id === num) || (curSnailTile && curSnailTile.id === num)) {
        num = getRandomNum(15);
    }
    
    curMoonTile = document.getElementById(num);
    curMoonTile.appendChild(moonTile);
}

function checkSnailTile() {
    if (gameOver) {
        return;
    }

    if (curSnailTile) {
        snailClicked = false;
        curSnailTile.innerHTML = "";
        curSnailTile.style.boxShadow = "none";
    }

    let ranChance = Math.floor(Math.random() * 25);
    if (ranChance !== 1 || speed === 20) {
        snailClicked = true;
        return;
    }

    let snailTile = document.createElement("img");
    snailTile.src = "Sprites/snail.png";
    let num = getRandomNum(15);
    while ((curSunTile && curSunTile.id === num) || (curMoonTile && curMoonTile.id === num) || (curSnailTile && curSnailTile.id === num)) {
        num = getRandomNum(15);
    }

    curSnailTile = document.getElementById(num);
    curSnailTile.appendChild(snailTile);
}

function changeTileTimeout() {
    if (tilesSinceClick > 5) {
        loseAudio.play();
        curSunTile.style.opacity = "50%";
        document.getElementById("score").innerText += "\nClick on the sun to retry.";
        gameOver = true;
    }
    
    if (gameOver) {
        return;
    }

    if (initialGameStarted) {
        let t;
        if (tilesShown % 10 === 0 && speed > 8 && tilesShown !== 0) {
            speed -= 2;
            document.getElementById("score").innerText = "Charges: " + score.toString() + "\nSpeed: " + ((20 - speed)/2).toString();
        }

        t = getRandomNum(speed) * 100;
        while (t < (speed * 100) / 4) {
            t = getRandomNum(speed) * 100;
        }
        setTimeout(setSunTile, t);
        setTimeout(setMoonTile, t);
        setTimeout(checkSnailTile, t);
    }
    else {
        document.getElementById("score").innerText = "Charge the sun to start.";
        setSunTile();
        setMoonTile();
    }
}

function selectTile() {
    if (this === curSunTile && gameOver) {
        chargeAudio.play();
        curSunTile.style.boxShadow = "none";
        curSunTile.style.opacity = "100%";
        curMoonTile.style.boxShadow = "none";
        curSunTile.innerHTML = "";
        curMoonTile.innerHTML = "";
        speed = 20;
        tilesShown = 0;
        tilesSinceClick = 0;
        score = 0;
        gameOver = false;
        sunClicked = false;
        changeTileTimeout();
        document.getElementById("score").innerText = "Charges: 0\nSpeed: 0";
        return;
    }

    if(gameOver) {
        return;
    }
    if (this === curSunTile && !sunClicked) {
        chargeAudio.play();
        curSunTile.style.boxShadow = "inset 0 0 100px yellow";
        score++;
        sunClicked = true;
        tilesSinceClick = 0;
        document.getElementById("score").innerText = "Charges: " + score.toString() + "\nSpeed: " + ((20 - speed)/2).toString();
        if (!initialGameStarted) {
            initialGameStarted = true;
            changeTileTimeout();
        }
    }
    if (this === curMoonTile) {
        loseAudio.play();
        curSunTile.style.boxShadow = "none";
        curMoonTile.style.boxShadow = "inset 0 0 100px black";
        curSunTile.style.opacity = "50%";
        document.getElementById("score").innerText += "\nClick the sun to retry.";
        gameOver = true;
    }

    if (this === curSnailTile && !snailClicked && speed < 20) {
        slowDownAudio.play();
        curSnailTile.style.boxShadow = "inset 0 0 100px brown";
        speed += 2;
        snailClicked = true;
        document.getElementById("score").innerText = "Charges: " + score.toString() + "\nSpeed: " + ((20 - speed)/2).toString();
    }
    else if (this === curSnailTile) {
        cancelAudio.play();
    }
}