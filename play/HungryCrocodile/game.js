//Properties of each game character
class Item {
  constructor(name, x=0, y=0, dx=0, dy=0, w=0, h=0, value=0) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.w = w;
    this.h = h;
    this.value = value;
    this.emotion = 0;
    
    this.onscreen = false;
    this.wait_to_appear = 5;
    if (Math.floor(Math.random() * 11) > 5){
    	this.onscreen = true;
      this.wait_to_appear = 0;
    }
  }
  // set x, y
  setStartPosition(x, y) {
    this.x = x;
    this.y = y;
    return 0;
  }
  // set dx, dy
  setTravelDirection(dx, dy) {
    this.dx = dx;
    this.dy = dy;
    return 0;
  }
  // width and height of img
  setDimensions(w, h) {
    this.w = w;
    this.h = h;
    return 0;
  }
  // points this is worth when eaten
  setValue(value) {
    this.value = value;
    return 0;
  }
  // set offscreen
  setOffScreen(wait) {
    this.onscreen = false;
    this.wait_to_appear = wait;
    return 0;
  }
  // name matching image of character
  updateImage(name) {
    this.name = name;
    return 0;
  }
  // how character is feeling
  updateEmotion(emotion) {
    this.emotion = emotion;
    return 0;
  }
}

// execute after html content is loaded
document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){
    var canvas = document.getElementById("HungryCrocCanvas");
    var ctx = canvas.getContext("2d");
   
    var t0_x = canvas.width*0.8;
    var t0_y = canvas.height*0.5;
    var t1_x = canvas.width*0.8;
    var t1_y = canvas.height*0.1;
    
    var dx = -2;
    var dy = 0;

    // score and matching crocodile feeling
    var score = 0;
    var c_feel = 0;
    var HAPPYTHRES = 5;
    var MADTHRES = -5;
    var SADTHRES = -10;

    // store images
    var Images = {};

    function loadImages(img_list){
        //load and save images in list
        count = 0
        for(var i = 0; i < img_list.length; i++){
            var img = new Image();
            Images[img_list[i].name] = img;
            img.onload = function(){
                count++;
                if(count == img_list.length){                
                }
            };
            img.src = img_list[i].url;
        }
    }
    
    function drawImage(img, locx=0, locy=0, sizex=500, sizey=500){
      ctx.drawImage(Images[img], locx, locy, sizex, sizey);
  }

    //load images from directory, make sure image is up to date
    var img_list = loadImages([{name: "ncc", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/ncc.png?"+Date.now()},
                               {name: "mcc", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/mcc.png?"+Date.now()},
                               {name: "scc", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/scc.png?"+Date.now()},
                               {name: "hcc", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/hcc.png?"+Date.now()},
                               {name: "food0", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/food0.png?"+Date.now()},
                               {name: "food1", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/food1.png?"+Date.now()},
                               {name: "trash0", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/trash0.png?"+Date.now()},
                               {name: "trash1", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/trash1.png?"+Date.now()},
                              ]);

    //properties of each character
    var crocodile = new Item("ncc", 0, canvas.height*0.5, 5, 5, 144, 82, 0); 
    var random_factor = Math.random();
    var frog = new Item("food0", canvas.width*0.8, Math.floor(Math.random() * canvas.height), -2, 0, 63, 46, 1);
    var bird = new Item("food1", canvas.width*0.8, Math.floor(Math.random() * canvas.height), -2, 0, 63, 48, 1);
    var garbage = new Item("trash0", canvas.width*0.8, Math.floor(Math.random() * canvas.height), -2, 0, 62, 48, -1);
    var litter = new Item("trash1", canvas.width*0.8, Math.floor(Math.random() * canvas.height), -2, 0, 63, 48, -1);
    
    // characters that can be eaten
    var things_to_eat = [frog, bird, garbage, litter]
    
    // check if character is on screen
    function isOnScreen(character){
      if (character.wait_to_appear == 0){
        if ((character.x >= 0)&&(character.x <= canvas.width * 0.8)){
          //x in canvas range
          if ((character.y >= 0)&&(character.y <= canvas.height * 0.8)){
            //y in canvas range
            character.onscreen = true;
          }
          else{
            //y is not in canvas range
            character.onscreen = false;
          }    	
        }
        else{
          //x is not in canvas range
          character.onscreen = false;
        }
      }
      else{
      	character.onscreen = false;
      }
			return character.onscreen;
    }
    
    /* Keyboard Controls
    			up arrow: crocodile moves up
          down arrow: crocodile moves down
          left arrow: crocodile moves left
          right arrow: crocdile moves right 
       Crocodile should not move off screeen
    */    
    // crocodile must be on screen
    crocodile.onscreen = true;
    document.addEventListener("keydown", keyDownHandler, false);
    function keyDownHandler(e) {
        if(e.code  == "ArrowUp") {
        	if (crocodile.y > 0){
            crocodile.y -= crocodile.dy;
            }
        }
        else if(e.code == 'ArrowDown') {
          if (crocodile.y < canvas.height){
            crocodile.y += crocodile.dy;
            }
        }
        if(e.code  == "ArrowLeft") {
        	if (crocodile.x > 0){
            crocodile.x -= crocodile.dx;
            }
        }
        else if(e.code == 'ArrowRight') {
          if (crocodile.x < canvas.height){
            crocodile.x += crocodile.dx;
            }
        }
    }
    
    // check if a character was eaten
    function eatStuff() {
        for (var i = 0; i < things_to_eat.length; i++){
        		var current_item = things_to_eat[i];
            
            // if on screen, check if item was eaten
            if (current_item.onscreen){
            	if(((current_item.x <= crocodile.x + crocodile.w) && (current_item.x >= crocodile.x)) && ((current_item.y <= crocodile.y + crocodile.h) && (current_item.y >= crocodile.y))){
                score += current_item.value;
                current_item.setStartPosition(canvas.width*0.8, canvas.height*0.5);
                current_item.setOffScreen(5);
              }
            
            }
        }
        
    }

    function getCrocImage(){
      //get image matching croc's feelings
      if (crocodile.emotion == 0){
        crocodile.updateImage("ncc");}
      else if (crocodile.emotion == 1){
      	crocodile.updateImage("hcc")}
      else if (crocodile.emotion == -1){
      	crocodile.updateImage("mcc");}
      else if (crocodile.emotion == -2){
        crocodile.updateImage("scc");}
      return 0;
    }

    function updateCrocFeel(score){
      //update croc's feelings based on current score
      if (score >= HAPPYTHRES){
        // happy
        crocodile.updateEmotion(1);}
      else if (score <= SADTHRES){
        // sad
        crocodile.updateEmotion(-2);}
      else if ((score > SADTHRES) && (score < 0)){
        // mad
        crocodile.updateEmotion(-1);}
      else{
        // neutral
        crocodile.updateEmotion(0)}
    }

    function drawCroc() {
        // update crocodile image based on feeling
        getCrocImage();
        drawImage(crocodile.name, crocodile.x, crocodile.y, crocodile.w, crocodile.h);
    }

    function drawThingsToEat() {
      for (var i = 0; i < things_to_eat.length; i++){
              var current_item = things_to_eat[i];
              if (isOnScreen(current_item)){
                // if on screen, draw item
                drawImage(current_item.name, current_item.x, current_item.y, current_item.w, current_item.h);
                // update movements
                current_item.x += current_item.dx;
                current_item.y += current_item.dy;
              }
              else{
                // wait time decreases by 1
                current_item.wait_to_appear -= 1;
              }
          }
    }
    
    function drawScore() {
        ctx.font = "1rem Courier New";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }

    function draw() {
        //clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // fill background
        ctx.fillStyle = "#ebf2f1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // check for updates
        eatStuff();
        updateCrocFeel(score);
        //draw characters
        drawThingsToEat();
        drawCroc();
        // draw game stats
        drawScore()
    }

    //refresh slowly
    setInterval(draw, 250);
}
