function submitLogin(){
  window.open("BookLog.html", "_top"); 
}
function submitRegister(){
   //if(!store(theForm){
      window.open("login.html", "_top");
   //}
}
//function to store user name and password
   function store(theForm) {
    //document.getElementById('welcomeMessage').innerHTML = "";
    var inputUsername= theForm["username"];
    var inputPassword= theForm["password"];
    localStorage.setItem("username", inputUsername.value);
    localStorage.setItem("password", inputPassword.value);
    window.open("login.html", "_top");
    //document.getElementById('welcomeMessage').innerHTML = "Welcome " + localStorage.getItem('username') + "!";
    return false;
   } // end store()

//function to sign in
   function login(theForm) {
    //document.getElementById('welcomeMessage').innerHTML = "";
    var inputUsername = theForm["username"];
    var inputPassword = theForm["password"];
    var username = inputUsername.value;
    var password = inputPassword.value;
    if ((username == localStorage.getItem('username')) && (password == localStorage.getItem('password'))) {
       window.open("Booklog.html", "_top");
     //document.getElementById('welcomeMessage').innerHTML = "Welcome " + localStorage.getItem('username') + "!";
      } 
	   //else {
	     
     //document.getElementById('welcomeMessage').innerHTML = "Invalid Log-in!";
    //}
    return false;
   } // end login()
