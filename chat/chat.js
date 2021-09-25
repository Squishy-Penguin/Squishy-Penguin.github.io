// execute after html content is loaded
document.addEventListener('DOMContentLoaded', downloaded, false);


function downloaded(){
	send_button = document.getElementById('sendButton');

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
      }
      
      /*Bot response*/
      var docFragMessage_2 = document.createDocumentFragment();
      var bot_response = document.createElement('p');
      /* message_to_send.style.float = "right"; */
      /* bot_response.style.float = "left" */;
      bot_response.id = "message";
      var message_contents = "I read your message";
      bot_response.innerHTML = message_contents;
      docFragMessage_2.appendChild(bot_response);
      display_area.appendChild(docFragMessage_2);
    }
  }
  sendMessage();
}
