
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

function init() {
  var books = [];
  var badges = [];

  if(localStorage.getObj('books') === null){
	localStorage.setObj('books', books);


	makeBook("Game of Thrones", "George R R Martin", "242", "6", true, "test summary");
	makeBook("Ender's Game", "Orson Scott Card", "242", "1.5", false, "");

	localStorage.setObj('sums', "");
  }
  updateBookLog();

  if(localStorage.getObj('pointHist') === null){
	localStorage.setObj('pointHist', badges);
  localStorage.setObj('user', badges);

  createUser("FILL_ME_IN", 4, 0);

  addPoints("Read 25 pages", 20);
	addPoints("Start a new book", 25);
  addPoints("3-day streak", 10);

  }

}

function updateBookLog(){

  var ul = document.getElementById("bookLogList");

  while( ul.firstChild ){
  ul.removeChild( ul.firstChild );
  }

  var bList = localStorage.getObj('books');

	for (var i = (bList.length-1); i >= 0; i--) {

      var li = document.createElement("li");
      var name = bList[i].title;

      var status = bList[i].pgNumber;
	  var time = bList[i].timeSpent;
	  var sumtext = bList[i].summary;
	  var sum = document.createElement("button");
	  sum.onclick = (function() {
		  var curSum = i;
		  return function (){
			  displaySummary(curSum + '');
		  }
	  })();
	  sum.setAttribute("style", "margin-top: 2%; margin-bottom: 2%;");
	  sum.appendChild(document.createTextNode("Click to view summary."));
      if(bList[i].finished){
        status = "Done"
      }else{
		  status = "Page " + status;
	  }
		var TN = document.createElement('p');
		TN.innerHTML = name+": "+status+", "+time+" hours";
		TN.setAttribute("style", "margin-bottom: 0%; text-decoration: underline; cursor: pointer;");
		TN.onclick = (function() {
		   var curInd = i;
		  return function (){
			  displayPgUpdate(curInd + '');
		  }
	  })();

      li.appendChild(TN);
	  li.appendChild(sum);
      ul.appendChild(li);
		}



}


function displayPgUpdate(ind){
	var bList = localStorage.getObj('books');
	var val = bList[ind].title;
	document.getElementById("pg-title").innerHTML = val;
	document.getElementById("update-pages").style.display = "block";
}

function closepgForm() {
	document.getElementById("update-pages").style.display = "none";
}

function pgSubmit() {
	closepgForm();
	var title = document.getElementById("pg-title").innerHTML;
	var currPg = document.getElementById("curr_pg_new").value;
	var newTime = document.getElementById("time_spent_new").value;
	var fin = document.getElementById("finish_new").checked;
	var sums = localStorage.getObj('sums')

	var bList = localStorage.getObj('books');

	for (var i = 0; i < bList.length; i++) {
		if (title == bList[i].title) {
			bList[i].pgNumber = currPg;
			var ts = parseFloat(bList[i].timeSpent) + parseFloat(newTime);
			bList[i].timeSpent = ts.toString();
			bList[i].finished = fin;
			if(bList[i].summary.length > 0){
				bList[i].summary = bList[i].summary + "<br />" + sums;
			} else{
				bList[i].summary = sums;
			}
		}
	}

	localStorage.setObj('books', bList);
	updateBookLog();
	localStorage.setObj('sums', "");
}

function displaySummary(ind){
	var bList = localStorage.getObj('books');
	var val = bList[ind].summary;
	if(val == ""){
		val = "No summary listed";
	}
	document.getElementById("sumdisplay-text").innerHTML = val;
	document.getElementById("sum-display").style.display = "block";
}

function openForm() {
	document.getElementById("myForm").style.display = "block";
}

function closeSummary() {
	document.getElementById("sum-display").style.display = "none";
}

function closeForm() {
	document.getElementById("myForm").style.display = "none";
}

function summarySubmit() {
	closeForm()
	var sumText = document.getElementById("summary-text").value;

	localStorage.setObj('sums', sumText);
}

function submitLog() {
	var elem = document.getElementById("form-log").elements;
	var logForm = [];
	for (var i = 0, element; element = elem[i++];) {
		if (element.name == "title" || element.name == "author" || element.name == "curr_pg" || element.name == "time_spent") {
			logForm.push(element.value);
		} else if (element.name == "finished") {
			logForm.push(element.checked);
		}

	}

	var sums = localStorage.getObj('sums')
    logForm.push(sums)
	var existsFlag = false;
	var bList = localStorage.getObj('books');

	for (var i = 0; i < bList.length; i++) {
		if (logForm[0] == bList[i].title) {
			if(logForm[2].length > 0){
				bList[i].pgNumber = logForm[2];
			}
			if(logForm[3].length > 0){
				var ts = parseFloat(bList[i].timeSpent) + parseFloat(logForm[3])
				bList[i].timeSpent = ts.toString();
			}

			bList[i].finished = logForm[4];
			if(bList[i].summary.length > 0){
				bList[i].summary = bList[i].summary + "<br />" + logForm[5];
			} else{
				bList[i].summary = logForm[5];
			}
			existsFlag = true;
		}
	}

	localStorage.setObj('books', bList);

	if(!existsFlag){
		makeBook(logForm[0], logForm[1], logForm[2], logForm[3], logForm[4], logForm[5]);
	}

  var msg = logForm[3];
  msg = "Read for " + msg + " hours";
  addPoints(msg, 20);
  msg = msg + " +20"
  popupReward(msg);

   updateBookLog();
   document.getElementById("form-log").reset();
   document.getElementById("summary-text").value = "";
   localStorage.setObj('sums', "");
   return false;

}


function makeBook(title, author, pgNumber, timeSpent, finished, summary) {
	var book = new Object();
	book.title = title;
	book.author = author;
	book.pgNumber = pgNumber;
	book.finished = finished;
	book.timeSpent = timeSpent;
	book.summary = summary;
	var bList = localStorage.getObj('books');
      bList.push(book);
	localStorage.setObj('books', bList);
}

function makeBadge(name, points, descrip, progress) {
	var badge = new Object();
	badge.name = name;
	badge.points = points;
  badge.descrip = descrip;
	badge.progress = progress;

	var badges = localStorage.getObj('badges');
      badges.push(badge);
	localStorage.setObj('badges', badges);
}

function addPoints(name, points) {
	var point = new Object();
	point.name = name;
	point.points = points;

	var pList = localStorage.getObj('pointHist');
      pList.push(point);
	localStorage.setObj('pointHist', pList);

  var user = localStorage.getObj('user');
  user[0].points = user[0].points + points;
  if(user[0].points >= 100){
    user[0].points = user[0].points - 100;
    user[0].lvl = user[0].lvl + 1;
    popupReward("LEVEL UP");
  }
  localStorage.setObj('user', user)
}

function createUser(name, lvl, points) {
	var user = new Object();
	user.name = name;
  user.lvl = lvl;
	user.points = points;

	var userList = localStorage.getObj('user');
      userList.push(user);
	localStorage.setObj('user', userList);
}

function popupReward(msg) {
  var popup = document.getElementById("myPopup");
  popup.innerHTML = msg;
  popup.classList.toggle("show");
}
