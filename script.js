/////////////////////////////////////////
//Değişkenler
let startContainer;
let startCanvas; let startCanvas2D;
let startCanvasBGColor = "#283052";

let StartOverlayLines;
let StartOverlayLinesRadius;
let StartOverlayLineNumber = 5000;

let gameContainer;
let gameCanvas; let gameCanvas2D;
let gameCanvasBGColor = "#0E141E";

let gameBorderPos = 80;
let gameBorderThickness = 7;
let gameBorderThicknessPos = gameBorderPos - gameBorderThickness;

let player;
let playerPosition;

let Bullets = [];
let Enemies = [];

let startButtonPressed = false;
let TotalEnemyKilled = 0;
/////////////////////////////////////////
//Sınıflar
class Entity { // 2D Hareket edebilen varlık sınıfı
    x = 0; y = 0; // Varlıgın anlık ekrana gore konumu
    xv = 1; yv = 1; // Varlıgın anlık eksenlere göre hızı
    size = 10;  // Boyutu 
    half_size = 5;
    color; // Rengi
    cns2D = null; // Varlıgın anlık kullandıgı canvas
    constructor(x,y,size,color,canvas2D){
        this.setSize(size);
        this.setStartPoint(x, y);
        this.setColor(color);
        this.setCanvas2D(canvas2D);
    };
    setSize(size) {
        this.size = size;
        this.half_size = size / 2;
    };
    setColor(color) {
        this.color = color;
    };
    setCanvas2D(set) {
        this.cns2D = set;
    };
    setStartPoint(dx, dy) {
        this.x = dx - this.size / 2;
        this.y = dy - this.size / 2;
    };
    setStartVelocity(xv, yv) {
        this.xv = xv;
        this.yv = yv;
    };
    getPositionAndScale() {
        return [this.center_x, this.center_y, this.size];
    };
    getMedianValue(a, b, c) {
        // Ortanca değeri bulan ve geri döndüren fonksiyon
        return Math.min(Math.max(a, b), c);
    };
};
class overlayLine extends Entity{
    //Baslangıc ekranındaki renkli kareler
    trail = 0;
    constructor(canvas2D, randomize = true) {
        super(0,0,0,0,canvas2D);
        if (randomize)
            this.randomize();
    };
    increaseSize(delta) {
        this.size += (delta * 30);
    };
    randomize() {
        //Konumunu, rengini ve hızını rasgele ata 
        this.x = Math.floor(Math.random() * windowWidth);
        this.y = Math.floor(Math.random() * windowHeight);

        this.xv = Math.floor((Math.random() * 10) - 5);
        this.yv = Math.floor((Math.random() * 10) - 5);

        this.color = "#" + Math.floor(Math.random() * 0xFFFFFFFF).toString(16);
        this.size = 0;
    };
    update(delta) {
        
        this.x += this.xv * delta * 25;
        this.y += this.yv * delta * 25;

        if (inputMap[" "]) StartOverlayLinesRadius = 20000; //Space tusuna basılı ise yuvarlagı buyut
        else StartOverlayLinesRadius = 2000;

        if (this.getMedianValue(0, this.x, windowWidth - this.size) != this.x)
            this.xv = Math.floor(Math.random() * Math.sign(0 - this.x) * 10);
        else if (this.getMedianValue(0, this.y, windowHeight - this.size) != this.y)
            this.yv = Math.floor(Math.random() * Math.sign(0 - this.y) * 10);
        else if (
            Math.abs(this.x - mousePosX) ** 2 + Math.abs(this.y - mousePosY) ** 2 < StartOverlayLinesRadius
        ) {
            this.size = Math.min((this.size + (delta * 100)), 20);
            this.trail = 15;
        }
        else {
            if (this.size > 0) {
                if (this.trail == 0)
                    this.size = Math.max((this.size - (delta * 25)), 0);
                else
                    this.trail--;
            }
        };
        this.cns2D.fillStyle = this.color;
        this.cns2D.fillRect(
            this.x, this.y, this.size, this.size
        );
    };
};
class Bullet extends Entity{
    constructor(x, y, speed, angle, size, offset, color, canvas2D) {
        super(
            x + Math.cos(angle) * offset,
            y + Math.sin(angle) * offset,
            size,color,canvas2D);
        this.setStartVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    };
    isCollidingWith(collider) {
        const distance = Math.sqrt((this.x - collider[0]) ** 2 + (this.y - collider[1]) ** 2);
        return distance < ((this.size + collider[2]) / 2);
    };
    isOutOfBounds() {
        if (this.getMedianValue(0, this.x, windowWidth) != this.x) return true;
        if (this.getMedianValue(0, this.y, windowHeight) != this.y) return true;
        return false;
    };
    draw() {
        this.cns2D.beginPath();
        this.cns2D.arc(this.x, this.y, this.half_size, 0, 6);
        this.cns2D.fillStyle = this.color;
        this.cns2D.fill();
    };
    update(delta) {
        this.x += this.xv * delta * 50;
        this.y += this.yv * delta * 50;
        this.draw()
    };
};
class Tank extends Entity{
    health = 100;
    center_x = 0; 
    center_y = 0;
    cooldown_max = 50;
    cooldown_left = 50
    constructor(x,y,size,color,canvas2D){
        super(x,y,size,color,canvas2D);
    };
    getHit() {
        this.health -= 10;
    };
    increaseHealth(amount){
        this.health = Math.min(this.health + amount, 100);
    };
    isAlive() {
        return this.health > 0;
    };
    kill(){
        this.health = 0;
    };
    drawBase() {
        // Tankın ana gövdesini çizdir
        this.cns2D.beginPath();
        this.cns2D.arc(this.center_x, this.center_y, this.half_size, 0, 6.3);
        this.cns2D.fillStyle = this.color;
        this.cns2D.fill();
        this.cns2D.lineWidth = 3;
        this.cns2D.stroke();
    };
    drawWeapon(target_x,target_y) {
        //Silah namlusunu çizdir
        this.barrelAngle = Math.atan2(target_y - this.center_y, target_x - this.center_x); // Açıyı hesapla
        this.cns2D.save(); // Canvası kaydet
        this.cns2D.translate(this.center_x, this.center_y); // Canvası silahı çizecegimiz noktaya taşı
        this.cns2D.rotate(this.barrelAngle); // Canvası açıya göre çevir 
        this.cns2D.lineWidth = 5; // Namlunun kalınlığı
        this.cns2D.lineCap = 'round'; // Namlunun ucunu yuletlat
        this.cns2D.beginPath(); 
        this.cns2D.moveTo(0, 0); 
        this.cns2D.lineTo(40, 0); // Namlunun  uzunluğu 
        this.cns2D.stroke(); // Çiz
        this.cns2D.restore(); // Canvası normal haline geri çevir

        //Silahın üst kapağını çiz
        this.cns2D.beginPath();
        this.cns2D.arc(this.center_x, this.center_y, this.half_size / 5, 0, 6.3);
        this.cns2D.fillStyle = "grey";
        this.cns2D.fill();
    };
    drawBorder(x,y,width,length,thickness,color){
        // Çerçeve çizen fonksiyon
        this.cns2D.fillStyle = color;
        this.cns2D.fillRect(
            x - thickness,
            y - thickness,
            width + thickness * 2,
            length + thickness * 2
        );
        this.cns2D.clearRect(
            x,
            y,
            width,
            length
        );
    };
    drawHealthBar() {
        // Can barını çizdir
        this.drawBorder(
            this.center_x - this.size,
            this.center_y + this.size,
            100,10,2,"white"
        );
        if (this.health < 50)
            this.cns2D.fillStyle = "red";
        else
            this.cns2D.fillStyle = "green";
        this.cns2D.fillRect(
            this.center_x - this.size,
            this.center_y + this.size,
            this.health,
            10
        );
    };
    shoot() {
        // cooldown 2 kursun arasında beklenmesi gereken sure 
        // update fonksiyonunda cooldownu azaltıyoruz 0 olunca 
        // oyuncu yada bilgisayar ates edebilir buradada tekrar 
        // max cooldowna esitleyerek beklemeyi sagliyoruz 
        this.cooldown_left = this.cooldown_max;
        Bullets.push(
            new Bullet(
                this.center_x, this.center_y,
                5,
                this.barrelAngle + Math.random() / 16 - 0.03,// Kursuna hafif sapma ver
                10,
                this.size,
                this.color,
                this.cns2D
            )
        );
    };
};
class Player extends Tank{
    // Eksen yönleri 1 yada -1 degeri alir
    // Eksen hizlari ile carpılarak oyuncunun gitmek
    // istedigi yone gitmesi saglanir
    xr = 1; yr = 1; 
    energy = 0; 
    ulti = false;
    powerUP = false;
    healthUP = false;
    barrelAngle; // Namlunun baktığı radyan cinsinden açı degeri
    constructor(x, y, size, color, canvas2D) {
        super(x,y,size,color,canvas2D);
    };
    getHit() {
        if (this.healthUP) {
            this.energy -= 1;
            if (this.energy <= 0)
                this.healthUP = false;
            this.increaseHealth(10);
        }
        else if(this.powerUP){
            this.increaseHealth(1);
            this.energy -= 2;
            if (this.energy <= 0)
                this.powerUP = false;
        }
        else
            this.increaseHealth(-5);// Normal durum
    };  
    drawEnergyBar() {
        // Enerji barını çiz
        this.drawBorder(
            this.center_x - this.size,
            this.center_y + this.size + 18,
            100,10,2,"white",gameCanvas2D
        );
        if (this.ulti) this.cns2D.fillStyle = "green";
        else if (this.powerUP || this.healthUP) this.cns2D.fillStyle = "steelblue";
        else this.cns2D.fillStyle = "yellow";

        this.cns2D.fillRect(
            this.center_x - this.size,
            this.center_y + this.size + 18,
            this.energy,
            10
        );
    };
    drawEnergyInfoLabel() {
        // Enerji dolunca ekranın üstüne uyarı yazısı yaz
        this.drawBorder(
            gameBorderPos + 2,
            12,
            windowWidth - gameBorderPos * 2 - 8,
            gameBorderPos - 32,2,"white",gameCanvas2D
        );
        this.cns2D.font = "36px serif";
        this.cns2D.fillText(
            "Enerjin Doldu!!! 'Shift' Alan , 'Space' Hız",
            gameBorderPos + 20, gameBorderPos - 28
        );
    };
    increaseEnergy() {
        if (this.energy < 100 && !this.ulti && !this.healthUP && !this.powerUP)
            this.energy += 5; // Normal durumda 
        else if(this.powerUP && this.energy < 100)
            this.energy += 1; // PowerUP durumunda
        // Diğer durumlarda arttırma
    };
    moveLeft() {
        this.xv = 5;
        this.xr = -1;
    };
    moveRight() {
        this.xv = 5;
        this.xr = 1;
    };
    moveUp() {
        this.yv = 5;
        this.yr = -1;
    };
    moveDown() {
        this.yv = 5;
        this.yr = 1;
    };
    isAlive() {
        // Ölmek için powerUP bitmesini bekle
        return this.health > 0 || this.powerUP;
    };
    shoot() {
        let bulletColor = this.color;
        if (this.powerUP) {
            this.energy--;
            if(this.health < 100)
                this.increaseHealth(1);
            if (this.energy <= 0)
                this.powerUP = false;
            this.cooldown = 1;
            bulletColor = `#${(Math.floor(Math.random()*0xDF)+0x10).toString(16)}0000`;
        }
        else if (this.healthUP){
            this.cooldown = 10;
            this.energy  -= 10;
            if (this.energy <= 0)
                this.healthUP = false;
            let randomRotationSeed = Math.random() * 1.55;
            for(let i = 0; i < 6.2; i = i+0.2){
                bulletColor = `#${(Math.floor(Math.random()*0xDF)+0x10).toString(16)}0000`;
                Bullets.push(
                    new Bullet(
                        this.center_x, this.center_y,
                        2,
                        this.barrelAngle+randomRotationSeed+i,
                        10,
                        this.size,
                        bulletColor,
                        this.cns2D
                    )
                );   
            };
        }
        else {
            this.cooldown = 10;
        };
        Bullets.push(
            new Bullet(
                this.center_x, this.center_y,
                5,
                this.barrelAngle,
                10,
                this.size,
                bulletColor,
                this.cns2D
            )
        );   
    };
    update(delta) {
        //Basılan tuşlara göre hareket et
        if (inputMap["w"]) this.moveUp();
        else if (inputMap["s"]) this.moveDown();

        if (inputMap["d"]) this.moveRight();
        else if (inputMap["a"]) this.moveLeft();

        this.cooldown = Math.max(--this.cooldown, 0); // Ateş etme bekleme süresini azalt
        if (!this.cooldown && inputMap["0"]) { // Bekleme süresi 0 ise ve tuşa basılmış ise ateş et
            this.shoot();
        };

        if (this.energy >= 100 && !this.healthUP && !this.powerUP) { 
            this.drawEnergyInfoLabel(); // Oyuncuya haber ver
            this.ulti = true;
            this.color = "red";
        };
        if (this.ulti) {
            if (inputMap["shift"]) {
                this.ulti = false;
                this.healthUP = true;
                this.color = "green";
            }
            else if (inputMap[" "]) {
                this.ulti = false;
                this.powerUP = true;
                this.color = "green";
            };
        };

        // İstenilen hıza göre ilerlet
        this.x += Math.max(this.xv--, 0) * this.xr * delta * 50;
        this.y += Math.max(this.yv--, 0) * this.yr * delta * 50; 

        // Oyuncuyu çerçevenin içinde tut
        this.x = this.getMedianValue(
            gameBorderPos, this.x, windowWidth - this.size*2 - gameBorderPos);
        this.y = this.getMedianValue(
            gameBorderPos, this.y, windowHeight - this.size*2 - gameBorderPos);

        //Merkezi güncelle
        this.center_x = this.x + this.half_size;
        this.center_y = this.y + this.half_size;

        // Ekrana çiz
        this.drawBase();
        this.drawWeapon(mousePosX,mousePosY);
        this.drawHealthBar();
        this.drawEnergyBar();
    }
};
class Enemy extends Tank{
    cooldown_left; // Ateş etme bekleme süresi 
    birthDelay = Math.floor((Math.random() * 300) + 50); // Doğmadan önce beklenilen süre
    constructor(x, y, size, color, canvas2D, cooldown_max) {
        super(x,y,size,color,canvas2D);
        this.cooldown_max = cooldown_max;
        this.cooldown_left = 0;
    };
    update(delta) {
        if (--this.birthDelay > 0) return; // Doğmayı bekle
        
        // Anlık hıza göre ilerle 
        this.x += this.xv * delta * 50;
        this.y += this.yv * delta * 50;

        // Çerçevenin içinde miyiz diye kontrol et
        // İçinde değil ise hızları yeniden hesapla 
        if (this.getMedianValue(gameBorderPos + 10, this.x, windowWidth - this.size * 3 - gameBorderPos) != this.x)
            this.xv = Math.floor(Math.random() * Math.sign(gameBorderPos + 10 - this.x) * 5);
        else if (this.getMedianValue(gameBorderPos + 10, this.y, windowHeight - this.size * 3 - gameBorderPos) != this.y)
            this.yv = Math.floor(Math.random() * Math.sign(gameBorderPos + 10 - this.y) * 5);

        // Merkezi güncelle
        this.center_x = this.x + this.half_size;
        this.center_y = this.y + this.half_size;

        // Bekleme süresi bitmiş ise ateş et
        if (this.cooldown_left-- <= 0) this.shoot(); 

        // Anlık durumu ekrana çiz 
        this.drawBase();
        this.drawWeapon(playerPosition[0],playerPosition[1]);
        this.drawHealthBar();
    }
};
/////////////////////////////////////////
//Yardımcı fonksiyonlar
function print(foo) {
    console.log(foo);
};
/////////////////////////////////////////
//Pencere Boyutu Değiştirilise Onu Ayarla
let windowWidth;
let windowHeight;
window.addEventListener("resize", () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    resizeGameCanvas();
    if (!startButtonPressed && !inGame)
        resizeStartCanvas();
});
function resizeGameCanvas() {
    //Çözünürlüğü yenile
    gameCanvas.width = windowWidth;
    gameCanvas.height = windowHeight;
};
function resizeStartCanvas() {
    startCanvas.width = windowWidth;
    startCanvas.height = windowHeight;
    //Start butonunu ortala
    let startButton = document.getElementById("startButton");
    startButton.style.left = (windowWidth / 2) - 50 + "px";
    startButton.style.top = (windowHeight / 2) - 50 + "px";
};
/////////////////////////////////////////
//Fare Konumunu Al
let mousePosX;
let mousePosY;
window.addEventListener('mousemove', (event) => {
    mousePosX = event.clientX;
    mousePosY = event.clientY;
});
/////////////////////////////////////////
//Klavye girişlerini ve fare tıklamalarını al
let inputMap = {
    " ": false, // Bosluk
    "0": false, // Fare Sol Tık
    "w": false,
    "a": false,
    "s": false,
    "d": false,
    "shift": false,
};
document.addEventListener("keydown", event => _input(event.key.toLowerCase(), true));
document.addEventListener("keyup", event => _input(event.key.toLowerCase(), false));
window.addEventListener('mousedown', event => _input(event.button, true));
window.addEventListener('mouseup', event => _input(event.button, false));
function _input(key_id, set) {
    //print(event.key);
    inputMap[key_id] = set;
    //print(inputMap);
};
/////////////////////////////////////////
//Canvasları Oluştur
function configGameCanvas() {
    gameContainer = document.createElement("div");
    gameContainer.id = "gameContainer";
    Object.assign(gameContainer.style, {
        top: 0, left: 0,
        width: "100%", height: "100%",
        backgroundColor: gameCanvasBGColor,
    });
    gameCanvas = document.createElement("canvas");
    gameCanvas.id = "gameCanvas";
    gameCanvas.width = windowWidth;
    gameCanvas.height = windowHeight;
    Object.assign(gameCanvas.style, {
        top: 0, left: 0,
        position: "absolute",
        opacity: 0,
        transition: "3s",
        backgroundColor: gameCanvasBGColor,
    });
    gameCanvas2D = gameCanvas.getContext("2d");
    gameContainer.appendChild(gameCanvas);
    document.body.appendChild(gameContainer);
};
function configStartOverlay() {
    startContainer = document.createElement("div");
    startContainer.id = "startOverlayContainer";
    startCanvas = document.createElement("canvas");
    startCanvas.width = windowWidth;
    startCanvas.height = windowHeight;
    startCanvas2D = startCanvas.getContext("2d");
    Object.assign(startCanvas.style, {
        top: 0, left: 0,
        position: "absolute",
        backgroundColor: startCanvasBGColor,
    });
    let startButton = document.createElement("button");
    startButton.id = "startButton";
    startButton.classList.add("startButton");
    Object.assign(startButton.style, {
        left: (windowWidth / 2) - 50 + "px",
        top: (windowHeight / 2) - 50 + "px",
        position: "absolute",
        backgroundColor: "transparent",
        width: "100px",height: "100px",
        border: "50px dashed lightblue",
        borderRight: "0px solid transparent",
        borderLeft: "0px solid transparent",
        transition: "0.2s",
    });
    startButton.addEventListener("click", startButtonClicked);
    startContainer.appendChild(startCanvas);
    startContainer.appendChild(startButton);
    document.body.appendChild(startContainer);

    if(!StartOverlayLines){ // Giriş çizgileri oluşturulmamış ise oluştur
        StartOverlayLines = [];
        for (let i = 0; i < StartOverlayLineNumber; i++) { 
            StartOverlayLines.push(new overlayLine(startCanvas2D));
        };
    }
    else{ // Oluşturulmuş ise yeni canvasa taşı
        for (let i = 0; i < StartOverlayLineNumber; i++) {
            StartOverlayLines[i].setCanvas2D(startCanvas2D);
            StartOverlayLines[i].randomize();
        };
        startContainer.animate([ // Kararma animasyonu yap
            {opacity: '0'},
            {opacity: '1'},
        ], {
            duration: 1000,
            fill: 'forwards'
        });
    };
};
/////////////////////////////////////////
//Buton tıklamalarını ayarla
function startButtonClicked() {
    let startButton = document.getElementById("startButton");
    for (let i in StartOverlayLines) {
        StartOverlayLines[i].setColor(gameCanvasBGColor);
    };
    startButtonPressed = true;
    startButton.style.opacity = 0;
};
/////////////////////////////////////////
//Ready fonksiyonu
function _ready() {
    // Ekran boyutunu al
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    // Fareyi ortala
    mousePosX = windowWidth / 2;
    mousePosY = windowHeight / 2;
    // Oyun ve başlangıç nodelarını oluştur
    configGameCanvas();
    configStartOverlay();
    startTerminator = 0; // Başlangıç bekleme süresini sıfırla
    requestAnimationFrame(mainLoop);
};
/////////////////////////////////////////
//Start Process (Giriş ekranı)
let startTerminator = 0;
let spaceInfoTimer = 5000;
let scoreText = "";
function _startProcess(delta) {
    if (startButtonPressed) { // Başlat butonuna basıldı ise
        for (let i in StartOverlayLines) {
            StartOverlayLines[i].increaseSize(delta);
        };
        if (++startTerminator == 200) { // Ekranın kararmasını bekle
            startButtonPressed = false;

            player = new Player(
                windowWidth / 2, windowHeight / 2, 50, "green", gameCanvas2D
            );
            playerPosition = player.getPositionAndScale();

            Enemies = [];
            Enemies.fill(0,0,EnemyNumber);
            TotalEnemyKilled = EnemyNumber * -1; // Skoru sıfırla

            gameCanvas.style.opacity = 1; 
            document.getElementById("startOverlayContainer").remove(); // Başlangıcı sil

            inGame = true // Oyun fonksiyonuna geç
        };
    }
    else {
        //startCanvas2D.clearRect(0, 0, windowWidth, windowHeight);

        let grdnt = startCanvas2D.createRadialGradient(
            mousePosX, mousePosY, 50, mousePosX, mousePosY, 2500);
        grdnt.addColorStop(0, "transparent");
        grdnt.addColorStop(1, "aqua");
        startCanvas2D.fillStyle = grdnt;
        startCanvas2D.fillRect(0, 0, windowWidth, windowHeight);

        startCanvas2D.font = "48px serif";
        startCanvas2D.strokeText("WASD - Hareket, Sol Tık - Ateş et", 10, windowHeight - 96);
        startCanvas2D.strokeText("Enerji+Shift - Alan,Enerji+Space - Hız", 10, windowHeight - 24);

        if (scoreText) {
            startCanvas2D.font = "36px serif";
            startCanvas2D.strokeText(scoreText, 10, 50);
            if (TotalEnemyKilled < 50){
                startCanvas2D.font = "24px serif";
                startCanvas2D.strokeText("Biraz zorlandın galiba diğer oyunu biraz daha kolay başlatacağım. :P",10,100);
            };
        }
        else {
            if (spaceInfoTimer < 500 && spaceInfoTimer > 0) {
                startCanvas2D.font = "36px serif";
                startCanvas2D.strokeText("Burada takılmayı sevdin galiba.:)", 10, 50);
                startCanvas2D.strokeText("Boşluk tuşuna basmayı denemiş miydin ?", 10, 100);
                startCanvas2D.strokeText("Bir işe yaramıyor ama güzel görünüyor bence.", 10, 150);
            }
            spaceInfoTimer--;
        };
    };
    for (let i in StartOverlayLines) {
        StartOverlayLines[i].update(delta);
    };
    requestAnimationFrame(mainLoop);
};
/////////////////////////////////////////
//Oyun sırasında kullanılan fonksiyonlar
const EnemyColors = ["blue", "pink", "orange", "maroon","purple","grey","brown"];
let EnemyCooldown = 50;
function generateNewEnemy() {
    //Yeni düşman oluşturma fonksiyonu
    //Oyuncunun anlık konumunu al
    //Düşmana rasgele bir boyut ver
    let newEnemySize = playerPosition[2] + Math.floor(Math.random() * 20) - 10;

    //Oluşturacağımız düşmanı oyuncunun çok yakınına doğurmamak için 
    //oyuncunun X konumuna bak oyuncu ekranın hangi tarafındaysa ters tarafa doğur.
    let newEnemyPosition_X;
    let newEnemyPosition_Y;
    if (playerPosition[0] > windowWidth / 2) {
        newEnemyPosition_X = gameBorderPos + Math.floor(Math.random() * windowWidth / 2);
    } else {
        newEnemyPosition_X = windowWidth / 2 + Math.floor(Math.random() * windowWidth / 2) - gameBorderPos;
    };
    //Y konumunuda rasgele ata ve çerçevenin içine yerleştir
    newEnemyPosition_Y = Math.min(Math.max(gameBorderPos, Math.floor(Math.random() * windowHeight - gameBorderPos),windowHeight - gameBorderPos * 2));
    
    //Rastgele renk al
    let EnemyColor = EnemyColors[Math.floor(Math.random() * EnemyColors.length)];
    EnemyCooldown = Math.max(--EnemyCooldown,5);
    //İstediğimiz özelliklere sahip düşmanı oluştur ve gönder
    return new Enemy(
        newEnemyPosition_X, newEnemyPosition_Y,
        newEnemySize,
        EnemyColor,
        gameCanvas2D,
        EnemyCooldown
    );
};
/////////////////////////////////////////
//Game Process
const EnemyNumber = 10;
let lastFrameTime = 0;
let inGame = false;
function mainLoop(timestamp) {
    // Delta son karenin cizilmesi icin gecen suredir. (Saniye) 
    const delta = (timestamp - lastFrameTime) / 1000; 
    lastFrameTime = timestamp;

    if (inGame)
        _gameProcess(delta);
    else
        _startProcess(delta);
}

function _gameProcess(delta) {
    //if(inputMap[" "]) delta /= 10;//Agir cekim modu ?
    //Oyun çerçevesini çiz
    gameCanvas2D.fillStyle = "white";
    gameCanvas2D.fillRect(
        gameBorderThicknessPos - gameBorderThickness,
        gameBorderThicknessPos - gameBorderThickness,
        windowWidth - gameBorderPos * 2 + gameBorderThickness * 2,
        windowHeight - gameBorderPos * 2 + gameBorderThickness * 2
    );
    gameCanvas2D.clearRect(
        gameBorderThicknessPos,
        gameBorderThicknessPos,
        windowWidth - gameBorderPos * 2,
        windowHeight - gameBorderPos * 2
    );
    for (let i = 0; i <= EnemyNumber; i++) {
        let SelectedEntity;
        if (i == EnemyNumber) { // Oyuncu ise
            if (!player.isAlive()) { // Oyuncu ölmüş ise 
                //Oyun canvasını kapat
                //Oyun canvasına transition ekledigimiz icin hemen 0 olmayacak
                gameCanvas.style.opacity = 0; 
                // Skor yazısını kaydet
                scoreText = "İyi deneme. :) " + TotalEnemyKilled + " tane tank patlatabildin.";
                //Oyun canvasının kararmasını bekledikten sonra oyunu kaldır ve başlangıca geri dön
                setTimeout(function () {
                    gameContainer.remove();
                    _ready();
                    }, 
                    4000
                );
                inGame = false
                if (TotalEnemyKilled < 50)
                    EnemyCooldown = 100; // Diğer oyunu biraz daha kolay başlat
                else
                    EnemyCooldown = 50; // Normal zorluk
                return; // Oyun bitti devam etmeye gerek yok
            };
            // Oyuncu ölmemiş ise oyuncuyu seç
            SelectedEntity = player;
            // Konumunu guncelle
            playerPosition = player.getPositionAndScale();
        }
        else if (!Enemies[i] || !Enemies[i].isAlive()) { // Düşman ölmüş ise
            //Skoru arttır
            TotalEnemyKilled++;
            //Yeni düşman oluştur ve seç
            Enemies[i] = generateNewEnemy();
            SelectedEntity = Enemies[i];
        }
        else {
            SelectedEntity = Enemies[i]; //Düşmanı seç
        };
        for (let j in Bullets) {
            if (Bullets[j].isCollidingWith(SelectedEntity.getPositionAndScale())) { 
                // Kurşun seçilen kişiye çarpmış ise  
                Bullets.splice(j, 1); // Kurşunu sil 
                SelectedEntity.getHit(); // Seçilen kişiye vur
                player.increaseEnergy(); // Oyuncuya enerji ver
            } else if (Bullets[j].isOutOfBounds()) { 
                // Kurşun ekranın dışına çıkmış ise
                Bullets.splice(j, 1); // Kurşunu sil
            }
            else {
                // Herhangi bir şey olmadıysa yoluna devam ettir
                Bullets[j].update(delta); 
            };
        };
        SelectedEntity.update(delta); // Seçilen kişiyi güncelle
    };
    requestAnimationFrame(mainLoop);
};
/////////////////////////////////////////