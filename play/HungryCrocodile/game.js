// execute after html content is loaded
document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){
    var canvas = document.getElementById("HungryCrocCanvas");
    var ctx = canvas.getContext("2d");

    var c_x = 0;
    var c_y = canvas.height*0.5;
    var c_width = 100 // to update!
    var c_height = 100 // to update!
    var t0_width = 50 // to update!
    var t0_height = 50 // to update!
    var t1_width = 50 // to update!
    var t1_height = 50 // to update!
    var f0_width = 50 // to update!
    var f0_height = 50 // to update!
    var f1_width = 50 // to update!
    var f1_height = 50 // to update!
   
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
    
    // crocodile moving
    document.addEventListener("keydown", keyDownHandler, false);
    function keyDownHandler(e) {
        if(e.code  == "ArrowUp") {
        	if (c_y > 0){
            c_y -= 5;
            }
        }
        else if(e.code == 'ArrowDown') {
          if (c_y < canvas.height){
            c_y += 5;
            }
        }
    }
    
    // crocodile ate
    function eatStuff() {
        if(((t0_x <= c_x + c_width) && (t0_x >= c_x)) && ((t0_y <= c_y + c_height) && (t0_y >= c_y))){
            score++;
            t0_x = canvas.width*0.8;
            t0_y = canvas.height*0.5;
        }
        else if(((t1_x <= c_x + c_width) && (t1_x >= c_x)) && ((t1_y <= c_y + c_height) && (t1_y >= c_y))){
            score++;
            t1_x = canvas.width*0.8;
            t1_y = canvas.height*0.2;
        }
    }

    function getCrocImage(croc_feeling){
      //get image matching croc's feelings
      if (croc_feeling == 0){
        return "ncc";}
      if (croc_feeling == 1){
        return "hcc";}
      if (croc_feeling == -1){
        return "mcc";}
      if (croc_feeling == -2){
        return "scc";}
    }

    function updateCrocFeel(score){
      //update croc's feelings based on current score
      if (score >= HAPPYTHRES){
        c_feel = 1;}
      else if (score <= SADTHRES){
        c_Feel = -2;}
      else if ((score > SADTHRES) && (score < 0)){
        c_Feel = -1;}
      else{
        c_feel = 0;}
    }

    function drawCroc() {
        drawImage(getCrocImage(c_feel), c_x, c_y, c_width, c_height);
    }

    function drawTrash() {
        drawImage("trash0", t0_x, t0_y, t0_width, t0_height);
        drawImage("trash1", t1_x, t1_y, t1_width, t1_height);
    }
    
    function drawScore() {
        ctx.font = "16px Arial";
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
        // draw game stats
        drawScore()
        //draw characters
        drawTrash();
        drawCroc();
        t0_x += dx;
        t0_y += dy;
        t1_x += dx;
        t1_y += dy;
    }

    //refresh slowly
    setInterval(draw, 500);
}
