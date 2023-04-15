const imgPath = './assets/images/'
let bone;
let firstRender = true;

function setup(){
    bone = loadImage(imgPath + "hone.png");
    createCanvas(800, 600);
    const cood = [width / 2, height / 2]
    const [x, y] = cood
    background(255);
    drawBomb(x, y, 20)
    fill(255, 255, 255);


}

function draw(){
    if(firstRender) {
        bone.resize(100, 100)
        image(bone, 200, 200)
        firstRender = false
    }
    
    fill(0, 0, 0);
    ellipse(mouseX, mouseY, 75, 75);
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