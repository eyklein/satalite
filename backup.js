// var satalites=[];
// var impacts=[];
// var earth;
// var counter=0;
// var imgEarth;
// var traceGraphic;


// var pressedPossition;

// var gravConstant = 6.67408*Math.pow(10,-11);
// var diamEarth = 12742000;
// var massEarth = 5.972*Math.pow(10,24);
// var distanceFactor = 500/diamEarth;
// var timeIncrease=90;//1 min = 90 min

// function preload(){
//   imgEarth=loadImage("img/earth.png");
//   imgSatalite=loadImage("img/satalite.png");
// }

// function setup() {
//   createCanvas(1000,1000);
//   traceGraphic=createGraphics(2000,2000);
  
//   earth=new satalite(5.972 * pow(10,15),500,0,imgEarth);//5.972 * pow(10,24)
//   earth.setPossition(width/2,height/2);
// }



// function draw() {
//   background(0,90);
//   earth.display();
  
  
//   for(var i=0;i<satalites.length;i++){
//     satalites[i].increment();
//     satalites[i].display();
//     satalites[i].displayTrace();
//   }
//   for(var j=0;j<impacts.length;j++){
//     impacts[j].display();
//   }
//   //console.log(impacts.length)
//   if(mouseIsPressed){
//     stroke(100);
//     line(pressedPossition.x,pressedPossition.y,mouseX,mouseY)
//   }
//   push();
//   tint(255, 126);
//   image(traceGraphic,0,0,1000,1000);
//   pop()
  
// }

// function mousePressed(){
//   pressedPossition=createVector(mouseX,mouseY);
// }

// function mouseReleased(){
//   satalites.push(new satalite(1000,10,0,imgSatalite));
//   satalites[satalites.length-1].setPossition(pressedPossition.x,pressedPossition.y);
//   satalites[satalites.length-1].launch(pressedPossition.x-mouseX,pressedPossition.y-mouseY);
// }


// function satalite(_mass,_diam,_color,_image){
//   this.myColor=_color;
  
//   this.img=_image;
  
//   this.mass=_mass; //
//   this.diam=_diam;//sqrt(this.mass)/1;
//   this.possition=createVector(0,0);// m    1 pix = 1 m
//   this.prevPossition=createVector(0,0);// m    1 pix = 1 m
//   this.speed=createVector(0,0);// m/s
//   this.accel=createVector(0,0);// m/s/s
//   this.force=createVector(0,0);// newtons
//   this.timeStamp=millis();
  
//   this.dead=false;
  
  
//   this.launch=function(_speedX,_speedY){
//     speedFactor=1;
//     this.speed.x=_speedX*speedFactor;
//     this.speed.y=_speedY*speedFactor;
//     //console.log(this.speed.x);
//   }
//   this.setPossition=function(_x,_y){
//     this.prevPossition.x=this.possition.x;
//     this.prevPossition.y=this.possition.y;
//     this.possition.x=_x;
//     this.possition.y=_y;
    
//   }
//   this.increment=function(){
//     if(!this.dead){
//       var deltaTime=millis()-this.timeStamp;
      
//       this.timeStamp=millis();
      
//       this.gravity()
      
//       this.speed.x+=this.accel.x*deltaTime/1000;
//       this.speed.y+=this.accel.y*deltaTime/1000;
      
//       this.prevPossition.x=this.possition.x;
//       this.prevPossition.y=this.possition.y;
//       this.possition.x+=this.speed.x*deltaTime/1000;
//       this.possition.y+=this.speed.y*deltaTime/1000;
      
//       if(this.vectorToEarth().mag()<=this.diam/2+earth.diam/2){
//         this.myColor=color(255);
//         this.kill();
//         impacts.push(new impact(this.vectorToEarth(),this.myColor))
//       }
//     }
//   }
//   this.kill=function(){
//     this.dead=true;
//   }
//   this.gravity=function(){
//     var gravVec=this.vectorToEarth();
//     var forceMag=(gravConstant*earth.mass*this.mass)/sq(gravVec.mag());
//     gravVec.normalize();
    
    
//     var forceVec = createVector(gravVec.x*forceMag,gravVec.y*forceMag);
    
//     this.accel.x=forceVec.x/this.mass;
//     this.accel.y=forceVec.y/this.mass;
//   }
//   this.impact=function(){
    
//   }
//   this.vectorToEarth=function(){
//     return createVector(earth.possition.x-this.possition.x,earth.possition.y-this.possition.y);
//   }
//   this.kineticEnergy=function(){
    
//     return 0.5*sq(this.speed.mag())*this.mass;
//   }
//   this.potentalEnergy=function(){
//     return -1*gravConstant*earth.mass*this.mass*this.vectorToEarth().mag();
//   }
//   this.display=function(){
//     if(!this.dead){
//       if(this.myColor!=0){
//         fill(this.myColor);
//         noStroke();
//         ellipse(this.possition.x,this.possition.y,this.diam,this.diam);
//       }
//       else{
//         image(this.img,this.possition.x-this.diam/2,this.possition.y-this.diam/2,this.diam,this.diam);
//       }
//     }
//   }
//   this.displayTrace=function(){
//     //traceGraphic.fill(255,20);
//     traceGraphic.stroke(30);
//     traceGraphic.line(this.possition.x,this.possition.y,this.prevPossition.x,this.prevPossition.y);
//   }
// }

// function impact(_vec,_color){
  
//   this.possition;
//   this.fragments=[];
//   this.color=_color;
  
//   this.setPossition=function(_vec){
//     _vec.normalize();
//     this.possition=createVector(_vec.x*earth.diam/2*-1, _vec.y*earth.diam/2*-1);
    
//     //this.fragments.push(new fragment(createVector(this.possition.x,this.possition.y),createVector(this.possition.x*random(0,10),this.possition.y*random(0,10)),createVector(this.possition.x*random(0,10),this.possition.y*random(0,10))));
    
//     for(var i=0;i<5;i++){
//       this.fragments.push(new fragment(createVector(this.possition.x,this.possition.y),createVector(this.possition.x*random(.5,1),this.possition.y*random(.7,1)),createVector(this.possition.x*random(.7,1),this.possition.y*random(.7,1))));
//     }
//   }
//   this.setPossition(_vec);
  
//   this.displayFragments=function(_pos){
//     for(var i=0;i<this.fragments.length;i++){
//       this.fragments[i].display();
//     }
//     //triangle(_pos.x,_pos.y,_pos.x*random(0,.5),_pos.y*random(0,.5),_pos.x*random(0,.25),_pos.y*random(0,.25));
//   }
  
//   this.display=function(){
//     //fill(255,255,255);
//     push();
//     fill(0);
    
//     translate(earth.possition.x, earth.possition.y);
    
//     this.displayFragments()
    
//     //ellipse(this.possition.x,this.possition.y,10,10);

//     pop();
    
    
//   }
// }

// function fragment(_v1,_v2,_v3){
//   this.v1=_v1;
//   this.v2=_v2;
//   this.v3=_v3;
//   this.display=function(){
//     triangle(this.v1.x,this.v1.y,this.v2.x,this.v2.y,this.v3.x,this.v3.y);
//   }
// }
