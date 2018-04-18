var satalites = [];
var impacts = [];
var earth;
var counter = 0;
var imgEarth;
var traceGraphic;
var sataliteGraphic;
var traces = [];
var tracesCount = 0;
//var mask;
var explotionGraphic;


var pressedPossition;

var gravConstant = 6.67408 * Math.pow(10, -11);
var diamEarth = 12742000; // m
var massEarth = 5.972 * Math.pow(10, 24);
var earthDisplayDiam = 500;
var distanceFactor = earthDisplayDiam / diamEarth;
var timeFactor = 90; //1 min = 90 min
var atmosphere = 160000; //160000
var speedFactor = 100; //for launching only

var orbits = [{
  "name": "Ground",
  "alt-abs": 12742000 / 2,
  "alt": 0
}, {
  "name": "Atmosphere",
  "alt-abs": 12742000 / 2 + 160000,
  "alt": 160000
}, {
  "name": "Low Earth Orbit",
  "alt-abs": 12742000 / 2 + 2000000,
  "alt": 2000000
}]

function preload() {
  imgEarth = loadImage("img/earth.png");
  imgSatalite = loadImage("img/satalite.png");

  myFont = loadFont('fonts/myfont.ttf');
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  traceGraphic = createGraphics(1000, 1000);
  // mask=createGraphics(1000,1000);
  // mask.background(10);
  traceGraphic.translate(width / 2, height / 2);
  sataliteGraphic = createGraphics(1000, 1000);
  sataliteGraphic.translate(width / 2, height / 2);
  explotionGraphic = createGraphics(1000, 1000);
  explotionGraphic.translate(width / 2, height / 2);
  //translate(width/2,height/2);

  earth = new satalite(massEarth, earthDisplayDiam, 0, imgEarth); //5.972 * pow(10,24)
  earth.setPossition(0, 0);

  textFont(myFont);
  textSize(30);
}



function draw() {
  background(0, 90);



  dimTrace()
    //traceGraphic.background(0)
    // for(var i=0;traces.length>i;i++){
    //   traces[i].display();
    // }
    //console.log(traces.length)

  if (dist(width / 2, height / 2, mouseX, mouseY) < earthDisplayDiam / 2) {
    cursor(WAIT); //not-allowed
  } else {
    cursor(CROSS);
  }

  if (satalites.length >= 1) {

    displayLastSatalite()

  }


  // translate(width/2,height/2)
  // text(mouseX +" : " + mouseY,50,50)
  // noStroke();
  // fill(255,10)
  // ellipse(width/2,height/2,(diamEarth+atmosphere*2)*distanceFactor,(diamEarth+atmosphere*2)*distanceFactor)

  //paintLayer(40000000,color(10))
  paintLayer(2000000, color(20))

  paintLayer(atmosphere, color(70))
  sataliteGraphic.push()
  sataliteGraphic.translate(-width / 2, -height / 2);
  sataliteGraphic.clear();
  sataliteGraphic.pop()
  earth.display();


  for (var i = 0; i < satalites.length; i++) {
    var hitAtmosphere = satalites[i].increment();
    satalites[i].display();
    satalites[i].displayTrace(hitAtmosphere);
  }
  for (var j = 0; j < impacts.length; j++) {
    impacts[j].display();
  }

  //console.log(impacts.length)
  if (mouseIsPressed) {
    stroke(color(200, 100, 100));
    line(pressedPossition.x, pressedPossition.y, mouseX, mouseY)
  }
  push();
  tint(255, 126);

  image(traceGraphic, 0, 0);
  image(sataliteGraphic, 0, 0)
  image(explotionGraphic, 0, 0)
  displayLaunchingSatalite()

  pop()

  if (satalites.length == 0) {
    push()
      //textAlign(CENTER);
    fill(255);

    noStroke();
    text("Click and Drag", width / 2, height - 50)
    pop()
  }

}

function displayLastSatalite() {
  noStroke();
  fill(150);
  var time = (millis() * timeFactor / 1000);
  var verticalSpacing = 40;
  text("Time: " + floor(time / 60) + " minutes", 50, 50 + verticalSpacing * 0);
  text("Speed: " + floor(satalites[satalites.length - 1].speed.mag() / 100) / 10 + " km/s", 50, 50 + verticalSpacing * 1);
  text("Altitude: " + floor((satalites[satalites.length - 1].possition.mag() - diamEarth / 2) / 100) / 10 + " km", 50, 50 + verticalSpacing * 2);
  var alt;
  if ((satalites[satalites.length - 1].possition.mag() < orbits[2]["alt-abs"])) {
    alt = orbits[2]["name"];
  } else {
    alt = "????"
  }
  text("Orbit: " + alt, 50, 50 + verticalSpacing * 3)
}

function displayLaunchingSatalite() {
  noStroke();
  fill(150);
  var verticalSpacing = 40;
  text("Altitude: " + floor((dist(mouseX, mouseY, width / 2, height / 2) / distanceFactor - diamEarth / 2) / 100) / 10 + " km", 400, 50 + verticalSpacing * 0);
  if (mouseIsPressed) {
    text("Speed: " + floor(sqrt(sq(pressedPossition.x - mouseX) + sq(pressedPossition.y - mouseY)) * 10) / 100 + " km/s", 400, 50 + verticalSpacing * 1);

    var vecToCenter = createVector(pressedPossition.x - width / 2, pressedPossition.y - height / 2);
    var vecLaunch = createVector(pressedPossition.x - mouseX, pressedPossition.y - mouseY);
    var dotProduct = vecLaunch.x * vecToCenter.x + vecLaunch.y * vecToCenter.y;
    var angle = floor(acos(dotProduct / (vecLaunch.mag() * vecToCenter.mag())) / PI * 180 * 100) / 100;
    text("Angle: " + angle + String.fromCharCode(176), 400, 50 + verticalSpacing * 2)



    //pressedPossition.x-mouseX,pressedPossition.y-mouseY);
  }
  //text("Altitude: "+ floor((satalites[satalites.length-1].possition.mag()-diamEarth/2)/100)/10+" km",50,90);
}

function paintAtmosphere() {
  //fill(255,10)
  var vEarthDiam = floor(diamEarth * distanceFactor);
  var vAtmosphereDiam = floor((diamEarth + atmosphere * 2) * distanceFactor);
  //strokeWeight(1);
  noStroke();
  //console.log(vEarthDiam +" : "+ vAtmosphereDiam)
  for (i = vEarthDiam; i < vAtmosphereDiam; i++) {
    // stroke(255-(i-vEarthDiam)*10);
    // stroke(255);
    //fill(255-(i-vEarthDiam)*100);
    fill(120);
    ellipse(width / 2, height / 2, i, i)
  }

}

function paintLayer(_altatude, _color) {
  //fill(255,10)

  var outerDiam = floor((diamEarth + _altatude * 2) * distanceFactor);
  //strokeWeight(1);
  noStroke();
  fill(_color)
    //console.log(vEarthDiam +" : "+ vAtmosphereDiam)

  ellipse(width / 2, height / 2, outerDiam, outerDiam)


}

function mousePressed() {
  pressedPossition = createVector(mouseX, mouseY);
}

function mouseReleased() {
  satalites.push(new satalite(1000, 10, 0, imgSatalite));
  satalites[satalites.length - 1].setPossition(pressedPossition.x - width / 2, pressedPossition.y - height / 2);
  satalites[satalites.length - 1].launch(pressedPossition.x - mouseX, pressedPossition.y - mouseY);
}


function satalite(_mass, _diam, _color, _image) {
  this.myColor = _color;

  this.img = _image;

  this.mass = _mass; // kg
  this.diam = _diam; // visual
  this.possition = createVector(0, 0); // m    
  this.possitionScreen = createVector(0, 0); // m 
  this.prevPossition = createVector(0, 0); // m    
  this.speed = createVector(0, 0); // m/s
  this.accel = createVector(0, 0); // m/s/s
  this.force = createVector(0, 0); // newtons
  this.timeStamp = millis();
  this.pVisualPossition = createVector(0, 0);
  this.visualPossition = createVector(0, 0);
  this.hitAtmosphere = false;

  this.dead = false;


  this.launch = function(_speedX, _speedY) {
    this.speed.x = _speedX * speedFactor;
    this.speed.y = _speedY * speedFactor;
    //console.log(this.speed.x);
  }
  this.setPossition = function(_x, _y) {
    this.prevPossition.x = this.possition.x;
    this.prevPossition.y = this.possition.y;
    this.possition.x = _x / distanceFactor;
    this.possition.y = _y / distanceFactor;

  }
  this.increment = function() {
    if (!this.dead) {
      var deltaTime = (millis() - this.timeStamp) / 1000 * timeFactor;


      this.timeStamp = millis();

      this.gravity()

      this.speed.x += this.accel.x * deltaTime;
      this.speed.y += this.accel.y * deltaTime;
      //console.log(this.vectorToEarth().mag()+" : "+((diamEarth+atmosphere*2))/2)
      if (this.vectorToEarth().mag() <= ((diamEarth + atmosphere * 2)) / 2) {
        this.hitAtmosphere = true;

        var magSpeed = this.speed.mag();
        //console.log(magSpeed)
        magSpeed = max(magSpeed * .9, 1000);
        this.speed.normalize();
        this.speed.x = this.speed.x * magSpeed;
        this.speed.y = this.speed.y * magSpeed;
      } else {
        this.hitAtmosphere = false;
      }

      this.prevPossition.x = this.possition.x;
      this.prevPossition.y = this.possition.y;
      this.possition.x += this.speed.x * deltaTime;
      this.possition.y += this.speed.y * deltaTime;
      this.possitionScreen.x = this.possition.x * distanceFactor;
      this.possitionScreen.y = this.possition.y * distanceFactor
        //console.log(this.speed.mag())


      if (this.vectorToEarth().mag() <= diamEarth / 2) {
        this.myColor = color(255);
        this.kill();
        impacts.push(new impact(this.vectorToEarth(), this.myColor))
      }
      return this.hitAtmosphere;
    }
  }
  this.kill = function() {
    this.possition.normalize();
    this.possition = createVector(diamEarth / 2 * this.possition.x, diamEarth / 2 * this.possition.y);
    this.speed.x = 0;
    this.speed.y = 0;
    this.dead = true;
  }
  this.gravity = function() {
    var gravVec = this.vectorToEarth();
    //console.log(gravVec.mag())
    var forceMag = (gravConstant * earth.mass * this.mass) / sq(gravVec.mag());
    // console.log(forceMag)
    gravVec.normalize();


    var forceVec = createVector(gravVec.x * forceMag, gravVec.y * forceMag);

    this.accel.x = forceVec.x / this.mass; //*distanceFactor;
    this.accel.y = forceVec.y / this.mass; //*distanceFactor;
    //console.log(this.accel.y)
  }
  this.impact = function() {

  }
  this.vectorToEarth = function() {
    //return createVector((earth.possition.x-this.possition.x)/distanceFactor,(earth.possition.y-this.possition.y)/distanceFactor);
    return createVector(this.possition.x * -1, this.possition.y * -1);
  }
  this.kineticEnergy = function() {

    return 0.5 * sq(this.speed.mag()) * this.mass;
  }
  this.potentalEnergy = function() {
    return -1 * gravConstant * earth.mass * this.mass * this.vectorToEarth().mag();
  }
  this.display = function() {
    if (!this.dead) {
      this.visualPossition = this.possition * distanceFactor;
      if (this.myColor != 0) {
        fill(this.myColor);
        noStroke();
        ellipse(this.possitionScreen.x, this.possitionScreen.y, this.diam, this.diam);
      } else {
        // sataliteGraphic.image(this.img,this.possitionScreen.x-this.diam/2,this.possitionScreen.y-this.diam/2,50,50);
        sataliteGraphic.image(this.img, this.possitionScreen.x - this.diam / 2, this.possitionScreen.y - this.diam / 2, this.diam, this.diam);
        //sataliteGraphic.ellipse(width/2,height/2,this.diam,this.diam)
      }
    }
  }

  this.displayTrace = function(_AtmosphereDrag) {
    //traceGraphic.fill(255,20);
    traceGraphic.stroke(60);
    if (_AtmosphereDrag) {
      traceGraphic.stroke(150, 70, 70);
    }
    traces[tracesCount % 300] = new Trace(this.possitionScreen.x, this.possitionScreen.y, this.prevPossition.x * distanceFactor, this.prevPossition.y * distanceFactor);
    tracesCount++;
    //traceGraphic.line(this.possitionScreen.x,this.possitionScreen.y,this.prevPossition.x*distanceFactor,this.prevPossition.y*distanceFactor);
  }
}

function possitionToDisplay(_pos) {
  return createVector(_pos.x * distanceFactor, _pos.y * distanceFactor);
}

function Trace(_x1, _y1, _x2, _y2) {
  this.v1 = createVector(_x1, _y1);
  this.v2 = createVector(_x2, _y2);

  this.display = function() {
    stroke(255);
    traceGraphic.line(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
  }
  this.display();

}

function impact(_vec, _color) {

  this.possition;
  this.fragments = [];
  this.color = _color;

  this.setPossition = function(_vec) {
    _vec.normalize();
    this.possition = createVector(_vec.x * earth.diam / 2 * (-1), _vec.y * earth.diam / 2 * (-1));

    //this.fragments.push(new fragment(createVector(this.possition.x,this.possition.y),createVector(this.possition.x*random(0,10),this.possition.y*random(0,10)),createVector(this.possition.x*random(0,10),this.possition.y*random(0,10))));

    for (var i = 0; i < 3; i++) {
      sin(i * PI * .8)
      this.fragments.push(new fragment(createVector(this.possition.x, this.possition.y), createVector(this.possition.x * random(.5, 1), this.possition.y * random(.7, 1)), createVector(this.possition.x * random(.7, 1), this.possition.y * random(.7, 1))));
    }
  }
  this.setPossition(_vec);

  this.displayFragments = function(_pos) {

    // for(var i=0;i<this.fragments.length;i++){
    //   this.fragments[i].display();
    // }

    //triangle(_pos.x,_pos.y,_pos.x*random(0,.5),_pos.y*random(0,.5),_pos.x*random(0,.25),_pos.y*random(0,.25));
  }

  this.display = function() {
    //fill(255,255,255);
    // push();
    // fill(0);
    // translate(earth.possition.x, earth.possition.y);
    //this.displayFragments()

    // //ellipse(this.possition.x,this.possition.y,10,10);

    // pop();


  }
}

function dimTrace() {
  //traceGraphic.background(0,3)
  //traceGraphic.mask(mask);
}

function fragment(_v1, _v2, _v3) {
  this.v1 = _v1;
  this.v2 = _v2;
  this.v3 = _v3;
  this.addExplotion = function() {
    explotionGraphic.noStroke();
    explotionGraphic.fill(100, 100);


    explotionGraphic.triangle(this.v1.x, this.v1.y, this.v2.x, this.v2.y, this.v3.x, this.v3.y);
  }
  this.addExplotion();

}