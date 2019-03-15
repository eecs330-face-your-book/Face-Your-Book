Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

function init(){
	
}

function submitChange(){
	var user = localStorage.getObj('user')[0];
	var username = user.name;
	
	var curUsr = document.getElementById('curUsr').value;
	var newUsr = document.getElementById('newUsr').value;
	var repeatUsr = document.getElementById('repeatUsr').value;
	
	document.getElementById('curErr').innerHTML = "";
	document.getElementById('newErr').innerHTML = "";
	document.getElementById('repeatErr').innerHTML = "";

	if(curUsr != username){
		var errBox = document.getElementById('curErr');
		errBox.innerHTML = " Username doesn't match your username";
	}else{
		if(newUsr != repeatUsr){
			var errBox = document.getElementById('repeatErr');
			errBox.innerHTML = " New usernames don't match each other";
		}else if(newUsr == ""){
			var errBox = document.getElementById('newErr');
			errBox.innerHTML = " Please enter a new username";
		}else{
			user.name = newUsr;
			localStorage.setObj('user', [user]);
			var msg = "Updated username";
			popupReward(msg);

			document.getElementById("update-usr").reset();
		}
	}
	
}


function popupReward(msg) {
  var popupList = document.getElementById("popupList");
  var popup = document.createElement("span");
  popup.setAttribute("class", "popuptext");
  popup.innerHTML = msg;
  popup.classList.toggle("show");
  popup.onclick = (function() {
    var popupElement = popup;
    return function (){
      popupElement.parentNode.removeChild(popupElement);
    }
  })();
  popupList.appendChild(popup);

}


function signout(){
	localStorage.clear();
	window.open("login.html", "_top");
	
}