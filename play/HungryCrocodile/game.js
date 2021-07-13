// execute after html content is loaded
document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){
    var canvas = document.getElementById("HungryCrocCanvas");
    var ctx = canvas.getContext("2d");

    var c_x = 0;
    var c_y = canvas.height*0.5;
    var x = canvas.width*0.8;
    var y = canvas.height*0.5;
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
    var keyPressed = false;
    var moveUp = false;
    var moveDown = false;
    document.addEventListener('keydown', function(event) {const key = event.key; keyPressed = True;});
    document.addEventListener('keydown', function(event) {keyPressed = False;});
    if(keyPressed){
        switch (event.key) {
            case "ArrowUp":
                // Up pressed
                if (c_y < canvas.height){
                    c_y += 10;}
                break;
            case "ArrowDown":
                // Down pressed
                if (c_y > 0){
                    c_y -= 10;}
                break;
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
        drawImage(getCrocImage(c_feel), c_x, c_y, 100, 100);
    }

    function drawTrash() {
        drawImage("trash0",x,y, 100, 100);
    }

    function draw() {
        //clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // fill background
        ctx.fillStyle = "#ebf2f1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //draw elements
        drawTrash();
        drawCroc();
        x += dx;
        y += dy;
    }

    //refresh slowly
    setInterval(draw, 500);
}
