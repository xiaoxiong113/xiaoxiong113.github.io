var flakes = [];
var save = [];
var xMod = 0;
var singleMode = false;
var rate = .2;

function Flake(size, x, y){
  this.x = x?x:(random()*1.5 - .25)*width;
  this.y = y?y:-size;
  this.speed = size/20;
  
  this.selected = false;
  
  this.height = floor(size/2);
  this.width = floor(this.height*1.732);
  this.g = createGraphics(this.width, this.height);
  init(this.g, this.width, this.height);
  
  this.tick = function(){
    this.y += this.speed;
    this.x += xMod*this.speed/4;
  }
  
  this.render = function(){
    push();
    translate(this.x, this.y);
    for (var i = 0; i < 6; i++){
      push();
      rotate(PI*i/3);
      image(this.g, 0, 0);
      scale(-1, 1);
      image(this.g, 0, 0);
      pop();
    }
    pop();
  }
}

function init(g, w, h){
  g.background(0);
  g.noStroke();
  var s = w/60 + .5;
  g.fill(170*s, 220*s, 255*s);
  g.triangle(0, 0, w, 0, w, h);
  g.fill(0);
  g.triangle(w, 0, w, h, w*.8, h);
  g.triangle(w/2, h/2, w, h*random(), w, h);
  for (var i =0; i < 10; i++){
    g.triangle(random()*w, random()*h,
                   random()*w, random()*h,
                   random()*w, random()*h);
  }
  g.loadPixels();
  for (var i = 0; i < w; i++){
    for (var j = 0; j < h; j++){
      var p = (i+j*w)*4;
      g.pixels[p+3] = g.pixels[p+2];
    }
  }
  g.updatePixels();
}

function setup(){
  createCanvas();
  colorMode(HSB, 360, 100, 100, 100);
  ellipseMode(CENTER);
  textAlign(LEFT, TOP)
  textSize(20);
  windowResized();
}

function draw(){
  background(200, 100, 10);
  noStroke();
  xMod = sin(frameCount/500);
  
  for (var i = 0; i < flakes.length; i++){
    var f = flakes[i];
    if (!singleMode) f.tick();
    f.render();
    if (f.y - f.width > height){
      flakes.splice(i, 1);
      i--;
    } 
  }
  
  if (!singleMode && random() < .2){
    flakes.push(new Flake(pow(random(), 2)*50 + 15));
  }
  
  if (singleMode){
    push();
    fill(100);
    text("space: create a new snowflake\n" +
          "other: exit", 10, 10);
    pop();
  }
}

function keyPressed(){
  if (keyCode == 32){
    if (!singleMode) save = flakes;
    flakes = [];
    flakes.push(new Flake(min(width, height)*.5, width/2, height/2));
    singleMode = true;
  } else {
    if (singleMode) flakes = save;
    singleMode = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  flakes = [];
  flakes.push(new Flake(50));
}