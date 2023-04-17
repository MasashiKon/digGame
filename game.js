const imgPath = './assets/images/'
const soundPath = './assets/sounds/'
let firstRender = true;
let groundLayer;
let cood;
let x, y;
let limit = 0;
let itemPosContainer = [];
let itemsize = 100;
let revealedArr = [];
let lineBold = 20;
let isBlasting = false;
let blastingCount = 0;
let didWithdrawal = false;
let teaser = 0;
let survived = false;
let resultSE = false;
let digAjustment = 0;

const itemObj = {
    bone: null,
    skull: null,
    coin: null,
    fish: null,
    apple: null,
    jar: null,
    coins: null
}

const soundObj = {
    blast: null,
    dig: null,
    find: null,
    reset: null,
    success: null,
    fault: null
}

let bomb;
let shovel;

const itemNameArr = ["bone", "skull", "coin", "fish", "apple", "jar", "coins"];

function preload(){
    itemObj.bone = loadImage(imgPath + "hone.png");
    itemObj.skull = loadImage(imgPath + "body_zugaikotsu_skull.png");
    itemObj.coin = loadImage(imgPath + "money_kinka_krugarrand.png");
    itemObj.fish = loadImage(imgPath + "food_sakana_hone.png");
    itemObj.apple = loadImage(imgPath + "fruit_ao_ringo.png");
    itemObj.jar = loadImage(imgPath + "glass_kobin_cork.png");
    itemObj.coins = loadImage(imgPath + "coin_medal_gold.png");
    bomb = loadImage(imgPath + "bakuhatsu.png");
    shovel = loadImage(imgPath + "shvel_scoop.png");

    soundObj.blast = loadSound(soundPath + "blast.mp3");
    soundObj.dig = loadSound(soundPath + "dig.mp3");
    soundObj.find = loadSound(soundPath + "find.mp3");
    soundObj.reset = loadSound(soundPath + "reset.mp3");
    soundObj.success = loadSound(soundPath + "success.mp3");
    soundObj.fault = loadSound(soundPath + "fault.mp3");
}

function setup(){

    itemObj.bone.resize(100, 100)
    itemObj.skull.resize(100, 100)
    itemObj.coin.resize(100, 100)
    itemObj.fish.resize(100, 100)
    itemObj.apple.resize(100, 100)
    itemObj.jar.resize(100, 100)
    itemObj.coins.resize(100, 100)
    createCanvas(800, 600);
    cood = [width / 2, height / 2]
    x = cood[0], y = cood[1]

    reset();
    noCursor();
}

function draw(){
    if(isBlasting) {
        if(blastingCount === 0) {
            soundObj.blast.setVolume(0.2);
            soundObj.blast.play();
        }
        blastingCount++

        let vibeX = noise(blastingCount) * 100;
        let vibeY = noise(blastingCount + 100) * 100;
        background(255);
        imageMode(CENTER);
        image(bomb, width / 2, height / 2, 400 + vibeX, 400 + vibeY)

        if(blastingCount > 120) {
            isBlasting = false;
            blastingCount = 0;
        }
    } else if(limit > 255) {
        const fontsize = 32
        let amountOfMoney = 0;
        const score = itemPosContainer.reduce((pre, crr) => {
            if(crr.found) {
                if(crr.name === "coin") {
                    amountOfMoney += 10;
                } else if(crr.name === "coins") {
                    amountOfMoney += 500;
                }
                return pre + 1;
            } else {
                return pre;
            }
        }, 0)
        background(255);
        textAlign(CENTER, CENTER);
        textSize(fontsize);
        fill(0);
        if(didWithdrawal) {
            if(!resultSE) {
                soundObj.success.setVolume(0.3);
                soundObj.success.play();
                resultSE = true;
            }
            text(`You found ${score < 10 ? score : "all"} items!`, width / 2, height / 2)
            text("Press enter key to play again", width / 2 + fontsize + 10, height / 2 + fontsize + 10)

            if(amountOfMoney > 0) {
                textSize(15);
                text(`...and you earned ${amountOfMoney}G $$$`, width / 2, height / 2 + 200)
            }
        } else {
            if(teaser < 120) {
                teaser++
                text(`You got a explosion. And...`, width / 2, height / 2)
                survived =  Math.random() < 0.5
            } else {
                if(survived) {
                    if(!resultSE) {
                        soundObj.success.setVolume(0.3);
                        soundObj.success.play();
                        resultSE = true;
                    }
                    text(`You survived!`, width / 2, height / 2 - fontsize - 10);
                    text(`You found ${score < 10 ? score : "all"} items!`, width / 2, height / 2)
                    text("Press enter key to play again", width / 2, height / 2 + fontsize + 10)
            
                    if(amountOfMoney > 0) {
                        textSize(15);
                        text(`...and you earned ${amountOfMoney}G $$$`, width / 2, height / 2 + 200)
                    }
                } else {
                    if(!resultSE) {
                        soundObj.fault.setVolume(0.3);
                        soundObj.fault.play();
                        resultSE = true;
                    }
  
                    text(`You lost everything...`, width / 2, height / 2)
                    text("Press enter key to play again", width / 2, height / 2 + fontsize + 10)
                }
            }

        }



        if(keyIsPressed && key === "Enter") {
            reset();
        }

    } else {
        let randomX = 0;
        let randomY = 0;
        background(255);
        fill(0, 0, 0);
        // itemPosContainer.forEach(item => {

        //     item.dotsNotRevealed.forEach(coor => {
        //         point(coor[0], coor[1])
        //     })
            
        // })
        fill(255, 255, 255);
        imageMode(CENTER);
        itemPosContainer.forEach(item => {
            item.found ? image(itemObj[item.name], item.cood.x, item.cood.y, itemsize * 1.2, itemsize * 1.2) : image(itemObj[item.name], item.cood.x, item.cood.y);
        })
        imageMode(CORNER);

        if(firstRender) {
            firstRender = false
        }

        if(mouseIsPressed) {
            itemPosContainer.forEach(item => {
                if(item.found) return;
                item.dotsNotRevealed = item.dotsNotRevealed.filter(cood => { 
                    return dist(cood[0], cood[1], mouseX, mouseY) > lineBold / 2;
                })

                if(item.dotsNotRevealed.length < Math.pow(itemsize, 2) * 0.3) {
                    soundObj.find.play();
                    item.found = true;
                }
            })

            if(digAjustment === 0) {
                soundObj.dig.setVolume(0.5)
                soundObj.dig.play();
                soundObj.dig.stop(0.8);
            }

            limit += 0.18;
            groundLayer.line(pmouseX, pmouseY, mouseX, mouseY)
            digAjustment = (digAjustment + 1) % 50;
        }

        image(groundLayer, 0, 0)

        if(limit >= 200) {
            const sub = 55 - (255 - limit)
            randomX = random(-sub / 2, sub / 2);
            randomY = random(-sub / 2, sub / 2);
            if(limit > 255) {
                isBlasting = true;
            }
        }

        if(keyIsPressed && key === "q") {
            didWithdrawal = true;
            limit = 256;
        }

        drawBomb(90 + randomX  / 2, 160 + randomY / 2, limit < 256 ? limit : 0)
        textAlign(CENTER, TOP);
        textSize(15);
        text("Q key: Courageously Withdraw", width / 2, 20)
        image(shovel, mouseX, mouseY, 100, 100)
    }
    
}

function drawBomb(x, y, counter) {
    fill(201, 166, 118);
    beginShape();
    vertex(x + map(counter, 0, 255, 0, 20 / 3 * 2) + 20 / 3, y - map(counter, 0, 255, 0, 150 / 3 * 2) - 150 / 3);
    vertex(x + map(counter, 0, 255, 0, 30 / 3 * 2) + 30 / 3, y - map(counter, 0, 255, 0, 140 / 3 * 2) - 140 / 3);
    vertex(x + map(counter, 0, 255, 0, 25 / 3 * 2) + 25 / 3, y - map(counter, 0, 255, 0, 130 / 3 * 2) - 130 / 3);
    vertex(x + map(counter, 0, 255, 0, 25 / 3 * 2) + 25 / 3, y - map(counter, 0, 255, 0, 100 / 3 * 2) - 100 / 3);
    vertex(x + map(counter, 0, 255, 0, 30 / 3 * 2) + 30 / 3, y - map(counter, 0, 255, 0, 80 / 3 * 2) - 80 / 3);
    vertex(x + map(counter, 0, 255, 0, 20 / 3 * 2) + 20 / 3, y - map(counter, 0, 255, 0, 70 / 3 * 2) - 70 / 3);
    vertex(x + map(counter, 0, 255, 0, 10 / 3 * 2) + 10 / 3, y - map(counter, 0, 255, 0, 70 / 3 * 2) - 70 / 3);
    vertex(x + map(counter, 0, 255, 0, 20 / 3 * 2) + 20 / 3, y - map(counter, 0, 255, 0, 80 / 3 * 2) - 80 / 3);
    vertex(x + map(counter, 0, 255, 0, 15 / 3 * 2) + 15 / 3, y - map(counter, 0, 255, 0, 100 / 3 * 2) - 100 / 3);
    vertex(x + map(counter, 0, 255, 0, 18 / 3 * 2) + 18 / 3, y - map(counter, 0, 255, 0, 130 / 3 * 2) - 130 / 3);
    endShape(CLOSE);
    fill(counter, 0, 0);
    ellipse(x ,y, map(counter, 0, 255, 0, 100) + 50, map(counter, 0, 255, 0, 100) + 50);
    fill(255, 255, 255);
    ellipse(x + map(counter, 0, 255, 0, 20) + 10, y - map(counter, 0, 255, 0, 20) - 10, map(counter, 0, 255, 0, 20) + 10, map(counter, 0, 255, 0, 20) + 10);
} 

function reset() {
    limit = 0;
    itemPosContainer = [];
    groundLayer = createGraphics(width, height)
    groundLayer.background(189, 137, 18)

    groundLayer.strokeWeight(lineBold);
    groundLayer.blendMode(REMOVE)

    for(let i = 0; i < 10; i++) {
        let itemPosX, itemPosY

        do {
            itemPosX = Math.floor(Math.random() * (width - 100)) + 50;
            itemPosY = Math.floor(Math.random() * (height - 100)) + 50;
            if(itemPosX < 210 && itemPosY < 270) {
                continue;
            }
            if(itemPosContainer.length > 0 && itemPosContainer.some(item => {
                return dist(item.cood.x, item.cood.y, itemPosX, itemPosY) <= Math.sqrt(Math.pow(itemsize, 2) * 2);
            })){
                continue;
            } else {
                break;
            }
            
        } while(true);
       
        const itemIndex = Math.floor(Math.random() * itemNameArr.length)
        const itemRange = [];
        for(let i = -(itemsize / 2); i < itemsize / 2; i++) {
            for(let j = -(itemsize / 2); j < itemsize / 2; j++) {
                itemRange.push([itemPosX + i, itemPosY + j])
            }
        } 
        itemPosContainer.push({
            id: i + 1,
            name: itemNameArr[itemIndex],
            cood: {
                x: itemPosX,
                y: itemPosY
            },
            dotsNotRevealed: [...itemRange],
            found: false
        })
    }
    didWithdrawal = false;
    teaser = 0; 
    resultSE = false;

    soundObj.reset.setVolume(0.3);
    soundObj.reset.play();
}