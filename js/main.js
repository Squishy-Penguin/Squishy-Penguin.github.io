/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function open_Navigation() {
  document.getElementById("Shortcuts").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function close_Navigation() {
  document.getElementById("Shortcuts").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}
