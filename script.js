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

// Sound effects have individual audio variables so they can be preloaded
let chargeAudio = new Audio("SFX/charge.mp3");
chargeAudio.preload = "auto";
let loseAudio = new Audio("SFX/lose.mp3");
loseAudio.preload = "auto";
let slowDownAudio = new Audio("SFX/slow down.mp3");
slowDownAudio.volume = 0.5;
slowDownAudio.preload = "auto";
let voidAudio = new Audio("SFX/void.mp3");
voidAudio.preload = "auto";

window.onload = function() {
    prepGame();
}

function prepGame() {
    chargeAudio.load();
    loseAudio.load();
    slowDownAudio.load();
    voidAudio.load();
    for (let i = 0; i < 25; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    changeTileTimeout();
}

function getRanNum(r) {
    return Math.floor(Math.random() * r).toString();
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
    let num = getRanNum(20);
    while ((curMoonTile && curMoonTile.id === num) || (curSunTile && curSunTile.id === num) || (curSnailTile && curSnailTile.id === num)) {
        num = getRanNum(15);
    }
    
    curSunTile = document.getElementById(num);
    curSunTile.appendChild(sunTile);
    console.log("Set sun to " + num);
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
    let num = getRanNum(15);
    while ((curSunTile && curSunTile.id === num) || (curMoonTile && curMoonTile.id === num) || (curSnailTile && curSnailTile.id === num)) {
        num = getRanNum(15);
    }
    
    curMoonTile = document.getElementById(num);
    curMoonTile.appendChild(moonTile);
}

function checkSnailTile() {
    if (gameOver) {
        return;
    }

    snailClicked = false;
    if (curSnailTile) {
        curSnailTile.innerHTML = "";
        curSnailTile.style.boxShadow = "none";
    }

    let ranChance = getRanNum(15);
    if (ranChance !== "1" || speed === 20) {
        snailClicked = true;
        return;
    }

    let snailTile = document.createElement("img");
    snailTile.src = "Sprites/snail.png";
    let num = getRanNum(15);
    while ((curSunTile && curSunTile.id === num) || (curMoonTile && curMoonTile.id === num) || (curSnailTile && curSnailTile.id === num)) {
        num = getRanNum(15);
    }

    curSnailTile = document.getElementById(num);
    curSnailTile.appendChild(snailTile);
}

function changeTileTimeout() {
    if (tilesSinceClick > 5) {
        loseAudio.play();
        curSunTile.style.opacity = "50%";
        document.getElementById("score").innerText = "The sun died after " + score + " charge(s) at a speed of " + (20 - speed)/2 + "\nClick the sun to retry.";
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

        t = getRanNum(speed) * 100;
        while (t < (speed * 100) / 4) {
            t = getRanNum(speed) * 100;
        }
        setTimeout(checkSnailTile, t);
        setTimeout(setSunTile, t);
        setTimeout(setMoonTile, t);
    }
    else {
        document.getElementById("score").innerText = "Click on the sun to start.\nGood luck!";
        setSunTile();
        setMoonTile();
    }
}

function selectTile() {
    if (this === curSunTile && gameOver) {
        chargeAudio.currentTime = 0;
        chargeAudio.play();
        curSunTile.style.boxShadow = "none";
        curSunTile.style.opacity = "100%";
        curMoonTile.style.boxShadow = "none";
        curSunTile.innerHTML = "";
        curMoonTile.innerHTML = "";
        curSnailTile.innerHTML = "";
        snailClicked = true;
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

    if (gameOver) {
        return;
    }

    if (this === curSunTile && !sunClicked) {
        chargeAudio.currentTime = 0;
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
    else if (this === curMoonTile && initialGameStarted) {
        loseAudio.currentTime = 0;
        loseAudio.play();
        curSunTile.style.boxShadow = "none";
        curMoonTile.style.boxShadow = "inset 0 0 100px black";
        curSunTile.style.opacity = "50%";
        document.getElementById("score").innerText = "The sun died after " + score + " charge(s) at a speed of " + (20 - speed)/2 + "\nClick the sun to retry.";
        gameOver = true;
    }
    else if (this === curSnailTile && !snailClicked) {
        slowDownAudio.currentTime = 0;
        slowDownAudio.play();
        curSnailTile.style.boxShadow = "inset 0 0 100px brown";
        speed += 2;
        snailClicked = true;
        document.getElementById("score").innerText = "Charges: " + score.toString() + "\nSpeed: " + ((20 - speed) / 2).toString();

    }
    else if (initialGameStarted) {
        voidAudio.currentTime = 0;
        voidAudio.play();
    }
}