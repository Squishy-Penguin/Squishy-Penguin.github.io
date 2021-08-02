//Properties of each game character
class Item {
  constructor(name, x = 0, y = 0, dx = 0, dy = 0, w = 0, h = 0, value = 0) {
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
    this.wait_to_appear = 0; // will appear at start position when wait == 0
    if (Math.floor(Math.random() * 11) > 5) {
      this.onscreen = true;
      this.wait_to_appear = -1; // already appeared
    } else {
      this.onscreen = false;
      this.wait_to_appear = 50; // appears after 50 cycles
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
document.addEventListener('DOMContentLoaded', domloaded, false);

function domloaded() {
  var canvas = document.getElementById("HungryCrocCanvas");
  var ctx = canvas.getContext("2d");
  ctx.canvas.height = window.innerHeight;
  ctx.canvas.width = window.innerWidth;

  var top_offset = 20;
  // min y = (0*(canvas_height - 2h))
  // max x = canvas_width - w
  var all_start_y = [];
  for (i = 0; i < Math.floor((canvas.height - 50) / 50); i++) {
    all_start_y.push(top_offset + i * 50);
  }
  var available_start_y = all_start_y.slice();

  // score and matching crocodile feeling
  var score = 0;
  var c_feel = 0;
  var HAPPYTHRES = 5;
  var MADTHRES = -5;
  var SADTHRES = -10;

  // store images
  var Images = {};

  function loadImages(img_list) {
    //load and save images in list
    count = 0
    for (var i = 0; i < img_list.length; i++) {
      var img = new Image();
      Images[img_list[i].name] = img;
      img.onload = function() {
        count++;
        if (count == img_list.length) {}
      };
      img.src = img_list[i].url;
    }
  }

  function drawImage(img, locx = 0, locy = 0, sizex = 100, sizey = 100) {
    ctx.drawImage(Images[img], locx, locy, sizex, sizey);
  }

  //load images from directory, make sure image is up to date
  var img_list = loadImages([{
      name: "ncc",
      url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/ncc.png?" + Date.now()
    },
    {
      name: "mcc",
      url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/mcc.png?" + Date.now()
    },
    {
      name: "scc",
      url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/scc.png?" + Date.now()
    },
    {
      name: "hcc",
      url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/hcc.png?" + Date.now()
    },
    {
      name: "food0",
      url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/food0.png?" + Date.now()
    },
    {
      name: "food1",
      url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/food1.png?" + Date.now()
    },
    {
      name: "trash0",
      url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/trash0.png?" + Date.now()
    },
    {
      name: "trash1",
      url: "https://squishy-penguin.github.io/play/HungryCrocodile/img/trash1.png?" + Date.now()
    },
  ]);

  //properties of each character
  var crocodile = new Item("ncc", 0, canvas.height * 0.5, 5, 5, 144, 82, 0);

  //get a random y for each thing to eat
  var random_index = Math.floor(Math.random() * available_start_y.length);
  var start_y = available_start_y[random_index];

  //remove from list so they are not on top of each other    
  var index = available_start_y.indexOf(start_y);
  if (index > -1) {
    available_start_y.splice(index, 1);
  }
  var frog = new Item("food0", canvas.width - 50, start_y, -8, 0, 63, 46, 1);

  // random y for bird
  random_index = Math.floor(Math.random() * available_start_y.length);
  start_y = available_start_y[random_index];
  index = available_start_y.indexOf(start_y);
  if (index > -1) {
    available_start_y.splice(index, 1);
  }
  var bird = new Item("food1", canvas.width - 50, start_y, -5, 0, 63, 48, 1);

  // random y for garbage
  random_index = Math.floor(Math.random() * available_start_y.length);
  start_y = available_start_y[random_index];
  index = available_start_y.indexOf(start_y);
  if (index > -1) {
    available_start_y.splice(index, 1);
  }
  var garbage = new Item("trash0", canvas.width - 50, start_y, -8, 0, 62, 48, -1);

  // random y for littered bottle
  random_index = Math.floor(Math.random() * available_start_y.length);
  start_y = available_start_y[random_index];
  index = available_start_y.indexOf(start_y);
  if (index > -1) {
    available_start_y.splice(index, 1);
  }
  var litter = new Item("trash1", canvas.width - 50, start_y, -5, 0, 63, 48, -1);

  // characters that can be eaten
  var things_to_eat = [frog, bird, garbage, litter]

  /* Check if character is on screen*/
  function isOnScreen(character) {

    if (character.wait_to_appear == 0) {
      // update: character now visible
      character.onscreen = true;
      character.wait_to_appear = -1;

      // give it a random start position
      random_index = Math.floor(Math.random() * available_start_y.length);
      start_y = available_start_y[random_index];
      index = available_start_y.indexOf(start_y);
      if (index > -1) {
        available_start_y.splice(index, 1);
      }
      character.setStartPosition(canvas.width - 50, start_y);

    }

    // current visibility status of character
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
    if (e.code == "ArrowUp") {
      if (crocodile.y > top_offset) {
        crocodile.y -= crocodile.dy;
      }
    } else if (e.code == 'ArrowDown') {
      if (crocodile.y < canvas.height - crocodile.h) {
        crocodile.y += crocodile.dy;
      }
    }
    if (e.code == "ArrowLeft") {
      if (crocodile.x > 0) {
        crocodile.x -= crocodile.dx;
      }
    } else if (e.code == 'ArrowRight') {
      if (crocodile.x < canvas.width - crocodile.w - top_offset) {
        crocodile.x += crocodile.dx;
      }
    }
  }

  /* Score updates
  Check if something was eaten
   - score += value of what was eaten
   - if something was not eaten and moved offscreen,
     make it disappear
  */
  function eatStuff() {
    for (var i = 0; i < things_to_eat.length; i++) {
      var current_item = things_to_eat[i];

      // if on screen, check if item was eaten
      if (current_item.onscreen) {
        if ((current_item.x <= crocodile.x + crocodile.w) && (current_item.x >= (crocodile.x + crocodile.w * 0.3)) && (current_item.y <= crocodile.y + crocodile.h) && (current_item.y >= crocodile.y)) {
          score += current_item.value;

          // item disappears after being eaten
          current_item.setOffScreen(50);
          //re-add y to list of available y positions
          available_start_y.push(current_item.y);
          // arbitrary position
          current_item.setStartPosition(0, 0);
        } else if (current_item.x <= 0) {
          //item went offscreen without being eaten
          current_item.setOffScreen(50);
          //re-add y to list of available y positions
          available_start_y.push(current_item.y);
          // arbitrary position
          current_item.setStartPosition(0, 0);
        }

      }
    }

  }

  /* Update crocodile's emotions based on score
   - score >= happy thres: key 1: happy
   - score <= sad thres: key -2: sad
   - sad thres < score < 0: key -1: mad
   - 0 < score < happy thres: key 0: neutral
  */
  function updateCrocFeel(score) {
    //update croc's feelings based on current score
    if (score >= HAPPYTHRES) {
      // happy
      crocodile.updateEmotion(1);
    } else if (score <= SADTHRES) {
      // sad
      crocodile.updateEmotion(-2);
    } else if ((score > SADTHRES) && (score < 0)) {
      // mad
      crocodile.updateEmotion(-1);
    } else {
      // neutral
      crocodile.updateEmotion(0)
    }
  }

  function getCrocImage() {
    //get image matching croc's feelings
    if (crocodile.emotion == 0) {
      crocodile.updateImage("ncc");
    } else if (crocodile.emotion == 1) {
      crocodile.updateImage("hcc")
    } else if (crocodile.emotion == -1) {
      crocodile.updateImage("mcc");
    } else if (crocodile.emotion == -2) {
      crocodile.updateImage("scc");
    }
    return 0;
  }

  function drawCroc() {
    // update crocodile image based on feeling
    getCrocImage();
    drawImage(crocodile.name, crocodile.x, crocodile.y, crocodile.w, crocodile.h);
  }

  function drawThingsToEat() {
    for (var i = 0; i < things_to_eat.length; i++) {
      var current_item = things_to_eat[i];
      if (isOnScreen(current_item)) {
        // if on screen, draw item
        drawImage(current_item.name, current_item.x, current_item.y, current_item.w, current_item.h);
        // update movements
        current_item.x += current_item.dx;
        current_item.y += current_item.dy;
      } else {
        // wait time decreases by 1:5
        current_item.wait_to_appear -= Math.floor(Math.random() * 5);
        if (current_item.wait_to_appear < 0) {
          current_item.wait_to_appear = 0;
        }
      }
    }
  }

  function drawScore() {
    ctx.font = "2rem Courier New";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, top_offset, 20);
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
  setInterval(draw, 150);
}
