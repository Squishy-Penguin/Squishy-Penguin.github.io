// execute after html content is loaded
document.addEventListener('DOMContentLoaded', downloaded, false);


function downloaded() {
  send_button = document.getElementById('sendButton');

  function get_random_number(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
  /*Static word and phrases dictionaries*/
  /* _alphabet = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 10, 'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17, 'r': 18, 's': 19, 't': 20, 'u': 21, 'v': 22, 'w': 23, 'x': 24, 'y': 25, 'z': 26}; */
  _punctuation_from_python = "!\"#$%&'()*+, -./:;<=>?@[\]^_`{|}~;"

  _default_responses = [
    ["I", "read", "your", "message"], "hello", ["how", "are", "you?"], "oh", ["I", "don't", "understand"],
    ["please", "repeat"],
    ["your", "typing", "is", "so", "bad", "I", "don't", "understand", "it"],
    ["are", "you", "speaking", "gibberish?"],
    ["I'm", "sorry"],
    ["I", "need", "to", "go"],
    ["I", "didn't", "say", "anything"],
    ["I", "didn't", "say", "that"],
    ["You", "didn't", "say", "that"],
    ["I", "didn't", "know", "that"],
    ["Are", "you", "having", "a", "good", "day?"], "sigh", "hmm", ["I'm", "hungry"], "you?", "me?"
  ];

  greeting_phrases = ["hi", "hello", "yo", "hey", "howdy",
    "greetings", ["how", "do", "you", "do"],
    ["nice", "to", "meet", "you"],
    ["good", "morning"],
    ["good", "afternoon"],
    ["good", "evening"],
    ["long", "time", "no", "see"],
    ["it's", "been", "a", "while"],
    ["nice", "to", "see", "you"],
    ["it's", "great", "to", "see", "you"]
  ];

  farewell_phrases = ["bye", "goodbye", "later", "farewell", "cya", "night", ["see", "you"],
    ["see", "ya"],
    ["good", "night"],
    ["good", "talk"],
    ["i'm", "leaving"],
    ["im", "leaving"],
    ["going", "now"],
    ["i'm", "going"],
    ["im", "going"],
    ["i", "need", "to"]
  ];
  no_dont_leave_answers = [
    ["Please", "don't", "go"], ":(", "why", ["I", "don't", "want", "you", "to", "leave"],
    ["I", "will", "be", "sad"],
    ["I", "will", "miss", "you"],
    ["I", "will", "be", "mad"],
    ["I", "will", "cry"], "*cries*", ["I", "don't", "want", "you", "to"],
    ["Please", "stay"],
    ["I", "like", "talking", "with", "you"],
    ["Have", "a", "good", "rest", "*cries*"]
  ];

  disagreeable_phrases = [
    ["i'm", "not"],
    ["i'm", "not"],
    ["im", "not"],
    ["you're", "wrong"],
    ["ur", "wrong"], "because", ["don't", "make", "sense"]
  ];
  agreeable_answers = ["Fine", "why", "Ok", "sorry", ["whatever", "you", "say"]];

  binary_questions_phrases = ["?"];
  yes_answers = ["yes", ["all", "right"], "alright",
    ["very", "well"],
    ["of", "course"],
    ["by", "all", "means"], "sure", "certainly", "absolutely", "indeed", "agreed", ["roger", "that"], "aye", ["aye", "aye"], "yeah", "yah", "yep", "yup", "uh-huh", "okay", "yus", "OK", "ok", "okey-doke", "hmm", ["think", "about", "it"],
    ["I'll", "think", "about", "it"], "well..."
  ];
  no_answers = [
    ["no", "thanks"], "no", ["that's", "terrible"],
    ["no", "no", "no"],
    ["of", "course", "not"],
    ["by", "no", "means"],
    ["I'm", "not", "sure"], "nope", "nah", ["not", "sure"],
    ["certainly", "not"],
    ["no", "way"],
    ["I", "can't"],
    ["I", "just", "can't"],
    ["Please", "don't", "ask", "me", "that"],
    ["I", "don't", "understand"], "never"
  ];

  /*Dealing with gibberish
  - happens again: */
  received_gibberish_responses = [
    ["I", "don't", "understand"],
    ["?"],
    ["your", "typing", "is", "so", "bad", "I", "don't", "understand", "it"],
    ["are", "you", "speaking", "gibberish?"]
  ];

  received_gibberish_consecutive_max = get_random_number(2, 5);
  received_gibberish_discrete_max = get_random_number(2, 3)
  received_gibberish_consecutive_count = 0;
  received_gibberish_discrete_count = 0;


  function get_entropy(lowercase_string) {
    /*
    Helper function: calculate entropy of string
    in: character string called lowercase_string
    out: int entropy of the string
    */
    hash_entropy = new Map();
    var entropy = 0;

    for (var i = 0; i < lowercase_string.length; i++) {
      if (!_punctuation_from_python.includes(lowercase_string[i])) {
        if (hash_entropy.has(lowercase_string[i])) {
          hash_entropy.set(lowercase_string[i],
            hash_entropy.get(lowercase_string[i]) + 1);
        } else {
          hash_entropy.set(lowercase_string[i], 1);
        }
      }
    }

    //Shannon's Entropy: HSh = −Σipilog pi
    for (var [key, value] of hash_entropy) {
      var pi = value / lowercase_string.length;
      entropy += pi * Math.log2(pi);
    }
    entropy *= -1;

    console.log("DEBUG: Entropy = " + entropy);
    return entropy;
  }

  /*Helper to convert tokenized phrase to a string phrase*/
  function get_string_from_array(tokenized_phrase) {
    var phrase = "";
    for (var i = 0; i < tokenized_phrase.length; i++) {
      if (i > 0) {
        phrase += " ";
      }
      phrase += tokenized_phrase[i];
    }
    return phrase;
  }

  /****************************************/
  /* Understanding the message            */
  /****************************************/

  /*Check if phrase can be found in sentence*/
  function phrase_in_string(sentence, tokenized_phrase) {
    var phrase = get_string_from_array(tokenized_phrase);

    if (sentence.includes(phrase)) {
      return true;
    }
    return false;
  }

  /*Check if sentence has words that belong in the dictionary*/
  function string_is_type_word(sentence, dictionary) {
    //tokenize sentence
    const tokenized_sentence = sentence.split(/[ ,\n\r?]+/);
    console.log(`The tokenized sentence was is ${tokenized_sentence}`);
    for (var i = 0; i < tokenized_sentence.length; i++) {
      for (var j = 0; j < dictionary.length; j++) {
        //console.log(`Checking ${tokenized_sentence[i]} against ${dictionary[j]}`);
        if (dictionary[j].constructor.name == "Array") {
          // do a phrase check
          if (phrase_in_string(sentence, dictionary[j])) {
            return true;
          }
        } else {
          // do a word check
          if (tokenized_sentence[i].localeCompare(dictionary[j]) == 0) {
            // found a match!
            return true;
          }
        }
      }
    }

    return false;
  }

  /****************************************/
  /* Composing a response to the message  */
  /****************************************/
  function get_same_type_response(dictionary) {
    //select phrase randomly
    var random_i = Math.floor(Math.random() * dictionary.length);
    var response = "";
    if (dictionary[random_i].constructor.name == "Array") {
      response = get_string_from_array(dictionary[random_i]);
    } else {
      response = dictionary[random_i];
    }
    return response;
  }

  function sendMessage() {
    display_area = document.getElementById('all_sent_messages');

    send_button.onclick = function() {
      var docFragMessage = document.createDocumentFragment();
      var message_to_send = document.createElement('li');
      /* message_to_send.style.float = "right"; */
      /* message_to_send.style.float = "right" */
      ;
      message_to_send.id = "message";
      var message_contents = document.getElementById('newMessage').value;
      message_to_send.innerHTML = message_contents;

      if (message_contents.length > 0) {
        //send non-blank text
        docFragMessage.appendChild(message_to_send);
        display_area.appendChild(docFragMessage);

        //document.getElementById('debugMessage').innerHTML = message_to_send; // DEBUG

        //clear typing box
        document.getElementById('newMessage').value = "";

        /*Bot response*/
        var docFragMessage_2 = document.createDocumentFragment();
        var bot_response = document.createElement('p');
        /* message_to_send.style.float = "right"; */
        /* bot_response.style.float = "left" */
        ;
        bot_response.id = "message";
        var random_i = 0;
        var message_contents2 = get_same_type_response(_default_responses); //default response

        var case_unsensitive_message_contents = message_contents.toLowerCase();

        /************************/
        /* Responding by context*/
        /************************/

        // check if gibberish
        var entropy = get_entropy(case_unsensitive_message_contents);
        var threshold = 0;
        if (entropy <= threshold) {
          received_gibberish_consecutive_count += 1;
          if (received_gibberish_discrete_count == received_gibberish_discrete_max || received_gibberish_consecutive_count == received_gibberish_consecutive_max) {
            message_contents2 = "This is too confusing, I give up :'('"
          } else {
            message_contents2 = get_same_type_response(received_gibberish_responses);

            for (var i = 0; i < received_gibberish_consecutive_count; i++)
              message_contents2 += "!";
          }
        } else {
          if (received_gibberish_consecutive_count > 0) {
            //reset
            received_gibberish_consecutive_count = 0;
            received_gibberish_consecutive_max = get_random_number(2, 5);
            received_gibberish_discrete_count += 1;
          }
          if (string_is_type_word(case_unsensitive_message_contents, greeting_phrases)) {
            console.log(`\t Bot received a greeting!`);
            message_contents2 = get_same_type_response(greeting_phrases);
          } else if (string_is_type_word(case_unsensitive_message_contents, farewell_phrases)) {
            console.log(`\t Bot received a farewell!`);
            message_contents2 = get_same_type_response(no_dont_leave_answers);
          } else if (string_is_type_word(case_unsensitive_message_contents, disagreeable_phrases)) {
            console.log(`\t Bot received a disagreeable!`);
            message_contents2 = get_same_type_response(agreeable_answers);
          } else if (case_unsensitive_message_contents.includes("repeat")) {
            console.log(`\t Bot received a repeat command!`);
            message_contents2 = message_contents;
          } else if (case_unsensitive_message_contents.includes("?")) { //TO IMPROVE
            console.log(`\t Bot received a binary question!`);

            // pick yes or no answer randomly
            random_i = Math.floor(Math.random());
            if (random_i == 0) {
              message_contents2 = get_same_type_response(yes_answers);
            } else {
              message_contents2 = get_same_type_response(no_answers);
            }
          }
        }

        console.log(` The bot response is ${message_contents2}`);

        bot_response.innerHTML = message_contents2;
        docFragMessage_2.appendChild(bot_response);
        display_area.appendChild(docFragMessage_2);
      }


    }
  }
  sendMessage();
}
