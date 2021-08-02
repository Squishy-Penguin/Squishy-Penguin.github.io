// execute after html content is loaded
document.addEventListener('DOMContentLoaded', downloaded, false);


function downloaded(){
	send_button = document.getElementById('sendButton');

	function sendMessage(){
  	send_button.onclick = function () {
    	display_area = document.getElementById('all_sent_messages');
      var docFragMessage = document.createDocumentFragment();
      
      var message_to_send = document.createElement('li');
      message_to_send.style.float = "right";
      message_to_send.id = "message";
      var message_contents = document.getElementById('newMessage').value;
      message_to_send.innerHTML = message_contents;
      
      if (message_contents.length > 0){
      	//send non-blank text
        docFragMessage.appendChild(message_to_send);
        display_area.appendChild(docFragMessage);
        
        //clear typing box
        document.getElementById('newMessage').value = "";
      }      
    }
  }
  sendMessage();
}
