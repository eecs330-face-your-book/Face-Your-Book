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
	var pw = user.pw;
	
	var curPw = document.getElementById('curPw').value;
	var newPw = document.getElementById('newPw').value;
	var repeatPw = document.getElementById('repeatPw').value;
	
	document.getElementById('curErr').innerHTML = "";
	document.getElementById('newErr').innerHTML = "";
	document.getElementById('repeatErr').innerHTML = "";

	if(curPw != pw){
		var errBox = document.getElementById('curErr');
		errBox.innerHTML = " Password doesn't match your password";
	}else{
		if(newPw != repeatPw){
			var errBox = document.getElementById('repeatErr');
			errBox.innerHTML = " New passwords don't match each other";
		}else if(newPw == ""){
			var errBox = document.getElementById('newErr');
			errBox.innerHTML = " Please enter a new password";
		}else{
			user.pw = newPw;
			localStorage.setObj('user', [user]);
			var msg = "Updated password";
			popupReward(msg);
			document.getElementById("update-pw").reset();
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