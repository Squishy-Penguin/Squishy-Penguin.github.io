// execute after html content is loaded
document.addEventListener('DOMContentLoaded', downloaded, false);


function downloaded(){
	send_button = document.getElementById('sendButton');
	
	  /*Static word and phrases dictionaries*/
	  greeting_phrases = ["hi", "hello", "yo", "hey", "howdy",
			"greetings", ["how", "do", "you", "do"], 
			      ["nice", "to", "meet", "you"], 
			      ["good", "morning"], ["good", "afternoon"], 
			      ["good", "evening"], ["long", "time", "no", "see"], 
			      ["it's", "been", "a", "while"], ["nice", "to", "see", "you"], 
			      ["it's", "great", "to", "see", "you"]];

	  /*Helper to convert tokenized phrase to a string phrase*/
	  function get_string_from_array(tokenized_phrase){
		var phrase = "";
		for (var i = 0; i < tokenized_phrase.length; i++){
		if (i > 0){
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
	  function phrase_in_string(sentence, tokenized_phrase){
		var phrase = get_string_from_array(tokenized_phrase);

		if (sentence.includes(phrase)){
		return true;
	    }
	    return false;
	  }

	  /*Check if sentence has words that belong in the dictionary*/
	  function string_is_type_word(sentence, dictionary){
		//tokenize sentence
	    const tokenized_sentence = sentence.split(/[ ,\n\r?]+/);
	    console.log(`The tokenized sentence was is ${tokenized_sentence}`);
	    for (var i = 0; i < tokenized_sentence.length; i++){
		for (var j = 0; j < dictionary.length; j++){
		console.log(`Checking ${tokenized_sentence[i]} against ${dictionary[j]}`);
		if (dictionary[j].constructor.name == "Array"){   
			// do a phrase check
			if (phrase_in_string(sentence, dictionary[j])){
		  return true;
		  }
		}
		else{
			// do a word check
		  if (tokenized_sentence[i].localeCompare(dictionary[j]) == 0){
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
	  function get_same_type_response(dictionary){
		//select phrase randomly
	    var random_i = Math.floor(Math.random()*dictionary.length);
	    var response = "";
	    if (dictionary[random_i].constructor.name == "Array"){
		response = get_string_from_array(dictionary[random_i]);
	    }
	    else{
		response = dictionary[random_i];
	    }
	    return response;
	  }

	function sendMessage(){
	    display_area = document.getElementById('all_sent_messages');

		send_button.onclick = function () {
	      var docFragMessage = document.createDocumentFragment();
	      var message_to_send = document.createElement('li');
	      /* message_to_send.style.float = "right"; */
	      /* message_to_send.style.float = "right" */;
	      message_to_send.id = "message";
	      var message_contents = document.getElementById('newMessage').value;
	      message_to_send.innerHTML = message_contents;

	      if (message_contents.length > 0){
		//send non-blank text
		docFragMessage.appendChild(message_to_send);
		display_area.appendChild(docFragMessage);

		document.getElementById('debugMessage').innerHTML = message_to_send; // DEBUG

		//clear typing box
		document.getElementById('newMessage').value = "";

		/*Bot response*/
		var docFragMessage_2 = document.createDocumentFragment();
		var bot_response = document.createElement('p');
		/* message_to_send.style.float = "right"; */
		/* bot_response.style.float = "left" */;
		bot_response.id = "message";
		var message_contents2 = "I read your message"; //default response

		var case_unsensitive_message_contents = message_contents.toLowerCase();
		if (string_is_type_word(case_unsensitive_message_contents, greeting_phrases)){
			console.log(`\t Bot received a greeting!`);
			message_contents2 = get_same_type_response(greeting_phrases);
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
