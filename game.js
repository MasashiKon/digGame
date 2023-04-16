const imgPath = './assets/images/'
let firstRender = true;
let groundLayer;
let cood;
let x, y;
let limit = 0;
let itemPosContainer = [];
let itemsize = 100;
let revealedArr = [];
let lineBold = 20;

const itemObj = {
    bone: null,
    skull: null,
    coin: null,
    fish: null,
    apple: null,
    jar: null,
    coins: null
}

const itemNameArr = ["bone", "skull", "coin", "fish", "apple", "jar", "coins"];

function preload(){
    itemObj.bone = loadImage(imgPath + "hone.png");
    itemObj.skull = loadImage(imgPath + "body_zugaikotsu_skull.png");
    itemObj.coin = loadImage(imgPath + "money_kinka_krugarrand.png");
    itemObj.fish = loadImage(imgPath + "food_sakana_hone.png");
    itemObj.apple = loadImage(imgPath + "fruit_ao_ringo.png");
    itemObj.jar = loadImage(imgPath + "glass_kobin_cork.png");
    itemObj.coins = loadImage(imgPath + "coin_medal_gold.png");
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


    groundLayer = createGraphics(width, height)
    groundLayer.background(0, 0, 0, 100)

    groundLayer.strokeWeight(lineBold);
    groundLayer.blendMode(REMOVE)

    for(let i = 0; i < 10; i++) {
        let itemPosX, itemPosY

        do {
            itemPosX = Math.floor(Math.random() * (width - 100)) + 50;
            itemPosY = Math.floor(Math.random() * (height - 100)) + 50;
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
}

function draw(){
    background(255);
    drawBomb(x, y, limit)
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
                item.found = true;
            }
        })

        limit += 0.1
        groundLayer.line(pmouseX, pmouseY, mouseX, mouseY)
    }

    image(groundLayer, 0, 0)
}

function drawBomb(x, y, counter) {
    fill(201, 166, 118);
    beginShape();
    vertex(x + 20, y - 150);
    vertex(x + 30, y - 140);
    vertex(x + 25, y - 130);
    vertex(x + 25, y - 100);
    vertex(x + 30, y - 80);
    vertex(x + 20, y - 70);
    vertex(x + 10, y - 70);
    vertex(x + 20, y - 80);
    vertex(x + 15, y - 100);
    vertex(x + 18, y - 130);
    endShape(CLOSE);
    fill(counter, 0, 0);
    ellipse(x ,y, 150, 150);
    fill(255, 255, 255);
    ellipse(x + 30, y - 30, 30, 30);
} 