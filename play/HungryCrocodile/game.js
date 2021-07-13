var canvas = document.getElementById("HungryCrocCanvas");
var ctx = canvas.getContext("2d");
// fill background
ctx.fillStyle = "#ebf2f1";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var c_x = canvas.width/3;
var c_y = canvas.height/2;
var x = canvas.width;
var y = canvas.height/2;
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
    var count = 0;
    for(var i = 0; i < img_list.length; i++){
        var img = new Image();
        Images[img_list[i].name] = img;
        img.onload = function(){
            total++;
        };
        img.src = img_list[i].url;
    }
}

//load images from directory, no cache
var img_list = loadImages([{name: "ncc", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/ncc.png"+Date.now()},
                           {name: "mcc", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/mcc.png"+Date.now()},
                           {name: "scc", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/scc.png"+Date.now()},
                           {name: "hcc", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/hcc.png"+Date.now()},
                           {name: "food0", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/food0.png"+Date.now()},
                           {name: "food1", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/food1.png"+Date.now()},
                           {name: "trash0", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/trash0.png"+Date.now()},
                           {name: "trash1", url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/trash1.png"+Date.now()},
                          ]);

function getCrocImage(croc_feeling){
  //get image matching croc's feelings
  if croc_feeling == 0:
    return Images["ncc"]
  if croc_feeling == 1:
    return Images["hcc"]
  if croc_feeling == -1:
    return Images["mcc"]
  if croc_feeling == -2:
    return Images["scc"]
}

function updateCrocFeel(score){
  //update croc's feelings based on current score
  if (score >= HAPPYTHRES):
    c_feel = 1
  else if (score <= SADTHRES):
    c_Feel = -2
  else if ((score > SADTHRES) and (score < 0)) :
    c_Feel = -1
  else:
    c_feel = 0
}

function drawCroc() {
    ctx.drawImage(getCrocImage(c_feel), c_x, c_y);
}

function drawTrash() {
    ctx.drawImage(Images["trash0"], x, y);
}

function draw() {
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCroc();
    drawTrash()
    x += dx;
    y += dy;
}

//draw every 5 seconds
setInterval(draw, 5);
