// execute after html content is loaded
document.addEventListener('DOMContentLoaded', downloaded, false);


function downloaded() {  
  //hangman stick figure
  var errors = 0;
  
  var canvas = document.getElementById("HangmanCanvas");
  // resize canvas
  canvas.width = 200;
  canvas.height = 300;
  canvas.style.display = "flex";
  canvas.style.float = "left";
  var ctx = canvas.getContext("2d");
  
  var letterButtons = [];
  
  //hangman letters
  var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  
  /*Static repo of words for game*/
  repo_words = ["apple", "blizzard", "icebox", "subway", "staff",
                "car", "wavy", "funny", "yummy", "lucky", "length", "cow", 
                "duck", "chicken", "moose", "yak", "small", "tiny", "big", 
                "strong", "banana", "cherry", "pineapple", "cucumber", 
                "squash", "happy", "angry", "question", "cup", "plate", 
                "spoon", "ice-cream", "yogurt", "pizza", "shrimp", "steak", 
                "carrot", "noodles", "eggs", "honey", "pancakes", "milk", 
                "hotdog", "ketchup", "walnut", "cupcake", "chocolate", 
                "blanket", "pillow", "bed", "socks", "sweater", "jacket", 
                "mittens", "snowman", "ice", "skates", "bicycle", 
                "basketball", "volleyball", "soccer", "running", 
                "swimming", "cold", "hot", "surprise"];
  function process_word(word_for_game){
  	processed = [];
    // convert to all upper case
    for (var i = 0; i < word_for_game.length; i++){
    	processed.push(word_for_game[i].toUpperCase())
    }
    return (processed);
  }
  
  //select word randomly
  var random_i = Math.floor(Math.random()*repo_words.length);
  var word = process_word(repo_words[random_i]);
  let word_unique_letters = Array.from(new Set(word));  
  
  var guessed_wrong = [];  
  var guessed_word = [];
  // initialize missing guesses with ','
  for (var i = 0; i < word.length; i++){
    if (word[i] != "-"){
    	guessed_word.push('_'); // _ space
    }
    else{
    	//non alphabetical; user is not expected to guess these
    	guessed_word.push(word[i]);
    }
  }
  
  
  /* 
  Check player input
   - correct (true): letter exists in word
   - otherwise, incorrect (false)
  */  
  function isCorrect(letter){
  	for (var i = 0; i < word_unique_letters.length; i++){
    	if (word_unique_letters[i] === letter){
      	return true;
      }
    }
    return false;	
  }
  
  
  /*Update _ _ _ _*/
  function drawWordBlanks(guess='', isCorrect=false, reveal=false) {
    guessedWrong = document.getElementById('HangmanWrongGuesses');
    wordBlanks = document.getElementById('HangmanUnknownWord');
    // remove repeats if exist
    while (wordBlanks.firstChild) {
      wordBlanks.removeChild(wordBlanks.lastChild);
    }
    var docFragBlanks = document.createDocumentFragment();

    if (!isCorrect){
      guessed_wrong.push(guess);    	
    }
    
    if (reveal){
      for (var i = 0; i < word.length; i++){
        var blank = document.createElement('li');
        blank.id = 'blank';
        blank.innerHTML = word[i];
        docFragBlanks.appendChild(blank);
      }
    }
    else{
      for (var i = 0; i < word.length; i++){
        if (guessed_word[i].valueOf() === String('_').valueOf()){ // _ space
          if (word[i] === guess){
            // update _ with correctly guessed letter
            guessed_word[i] = guess;

          }
        }
        var blank = document.createElement('li');
        blank.id = 'blank';
        blank.innerHTML = guessed_word[i];
        docFragBlanks.appendChild(blank);
      }    
    }

    wordBlanks.appendChild(docFragBlanks);
    
    var guessed_wrong_string = "";
    for (var i = 0; i < guessed_wrong.length; i++) {
      guessed_wrong_string += guessed_wrong[i] + "  ";
    }
    guessedWrong.innerHTML = guessed_wrong_string;

  }

  
  /* Game over reached when errors = 9
   - disable buttons
   - reveal word
   - display game over
  */
  function gameOver(won=false){
    // display message
    if (won){
      document.getElementById("game_description").innerHTML = "YOU WIN!!! Refresh the page to play again.";

    }
    else{
      document.getElementById("game_description").innerHTML = "GAME OVER...refresh the page to play again!";
    }
    
    // disable buttons
    for (var i = 0; i < letterButtons.length; i++){
    	curr_button = letterButtons[i];
      curr_button.setAttribute("disabled", "disabled");      
    }
    
    // reveal word
    drawWordBlanks("", false, true);
  }
  
  
  /* Draw hangman on canvas by # wrong guesses by player
   - hierarchy:
    0: gallows
    1:"head",
    2:"body",
    3:"legL",
    4:"legR",
    5:"armL",
    6:"armR",
    7:"eyeL",
    8:"eyeR",
    9:"ohno" 
  */
  function drawHangman(part=""){
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // fill background
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // gallows
    ctx.beginPath();
    ctx.moveTo(5, canvas.height*0.9);
    ctx.lineTo(canvas.width-5, canvas.height*0.9);
    ctx.stroke();
    ctx.moveTo(10, canvas.height*0.9);
    ctx.lineTo(10, canvas.height*0.05);
    ctx.stroke();
    ctx.moveTo(10, canvas.height*0.05);
    ctx.lineTo(canvas.width*0.5, canvas.height*0.05);
    ctx.stroke();

    if (part > 0){
      // draw head
      ctx.beginPath();
      ctx.arc(canvas.width*0.5, canvas.height*0.25, canvas.width*0.2, 0, Math.PI * 2, true);
      ctx.stroke();

      if (part > 1){
        //draw body
        ctx.moveTo(canvas.width*0.5, canvas.height*0.25 + canvas.width*0.2);
        ctx.lineTo(canvas.width*0.5, canvas.height*0.25 + canvas.width*0.4);
        ctx.stroke();

        if (part > 2){
          //draw left leg
          ctx.moveTo(canvas.width*0.5, canvas.height*0.25 + canvas.width*0.4);
          ctx.lineTo(canvas.width*0.5 - canvas.width*0.3, canvas.height*0.7);
          ctx.stroke();

          if (part > 3){
            //draw right leg
            ctx.moveTo(canvas.width*0.5, canvas.height*0.25 + canvas.width*0.4);
            ctx.lineTo(canvas.width*0.5 + canvas.width*0.3, canvas.height*0.7);
            ctx.stroke();

            if (part > 4){
              //draw left arm
              ctx.moveTo(canvas.width*0.5, canvas.height*0.25 + canvas.width*0.2);
              ctx.lineTo(canvas.width*0.5 + canvas.width*0.3, canvas.height*0.3);
              ctx.stroke();

              if (part > 5){
                //draw right arm
                ctx.moveTo(canvas.width*0.5, canvas.height*0.25 + canvas.width*0.2);
                ctx.lineTo(canvas.width*0.5 - canvas.width*0.3, canvas.height*0.3);
                ctx.stroke();

                if (part > 6){
                  //draw left eye
                  ctx.moveTo(canvas.width*0.5-canvas.width*0.12+5, canvas.height*0.2);
                  ctx.arc(canvas.width*0.5-canvas.width*0.12, canvas.height*0.2, 5, 0, Math.PI * 2, true);
                  ctx.stroke();

                  if (part > 7){
                    //draw right eye
                    ctx.moveTo(canvas.width*0.5+canvas.width*0.12+5, canvas.height*0.2);
                    ctx.arc(canvas.width*0.5+canvas.width*0.12, canvas.height*0.2, 5, 0, Math.PI * 2, true);
                    ctx.stroke();

                    if (part == 9){
                      //draw mouth
                      ctx.moveTo(canvas.width*0.5-canvas.width*0.12, canvas.height*0.3);
                      ctx.arc(canvas.width*0.5, canvas.height*0.3, canvas.width*0.2*0.6, 0, Math.PI, true);
                      ctx.stroke();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  
  /*Check if player won game
   - true if all letters of word was guessed
  */
  function checkIfWin(){
    for (var i = 0; i < guessed_word.length; i++){
      if (guessed_word[i].valueOf() === String('_').valueOf()){
        return false;
      }
    }
    return true;
  }
  
  
  /* If player made a guess...
   - check if guess was correct
   - update word blanks
   - update hangman if wrong
   */
  function checkIfClicked(letter_button){
    letter_button.onclick = function () {
      var player_guess = letter_button.value;

      if (isCorrect(player_guess)){
        drawWordBlanks(player_guess, true);
      }
      else{
        drawWordBlanks(player_guess, false);
        errors += 1;
        drawHangman(errors);
      }

      // cannot click again
      letter_button.setAttribute("disabled", "disabled");
      // check if game is over because of win
      if (checkIfWin()){
        //word is complete, won
      	gameOver(true);
      }
      else if(errors == 9){
      	//max errors reached, lost
        gameOver(false);
      }
    }
  }
  
  
  /* 
  Create buttons for player to guess letters
  */  
  var inputLetters = document.getElementById('input_letters');
  var docFragAlphabet = document.createElement("ul");
  for (var i=0; i < letters.length ; i++){
    docFragAlphabet.id = "alphabet";
    var elem = document.createElement('input');
    elem.id = 'letter';
    elem.type = 'button';
    elem.value = letters[i].toUpperCase();
    elem.name = "lala";
    
    letterButtons.push(elem);
    
    checkIfClicked(elem);

    docFragAlphabet.appendChild(elem);
  }
  inputLetters.appendChild(docFragAlphabet);
  
  
  function playHangman(){    
    drawHangman();
    drawWordBlanks();
  }
  
  
  /* Start game*/
  playHangman();
}
