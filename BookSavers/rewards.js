Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

function init() {
    var books = [];
    var badges = [];

    if (localStorage.getObj('books') === null) {
        localStorage.setObj('books', books);

        makeBook("Game of Thrones", "George R R Martin", "242", "6", true, "test summary");
        makeBook("Ender's Game", "Orson Scott Card", "242", "1.5", false, "");

        localStorage.setObj('sums', "");

    }

    if (localStorage.getObj('badges') === null) {
        localStorage.setObj('badges', badges);

        makeBadge("Sci-Fi Novice", 20, "Read three sci-fi novels.", 100);
        makeBadge("Sci-Fi Savant", 100, "Read ten sci-fi novels.", 20);

    }

    if (localStorage.getObj('pointHist') === null) {
        localStorage.setObj('pointHist', badges);
        localStorage.setObj('user', badges);

        var usr = localStorage.getObj('username');
        var pw = localStorage.getObj('password');
        createUser(usr, 4, 0, pw);

        addPoints("Read 25 pages", 20);
        addPoints("Start a new book", 25);
        addPoints("3-day streak", 10);

    }

    var found = false;
    var user = localStorage.getObj('user');
    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");

    for (var i = 0; i < user.length; i++) {
        if (curUser == user[i].name) {
          found = true;
        }
    }
    if(!found){
      var pw = localStorage.getObj('password');
      createUser(curUser, 0, 0, pw);
    }

    updateBadges();
    updateRewardsTable();

}

function updateBadges() {

    var ul = document.getElementById("badgeHist");
	ul.setAttribute("style", "list-style-type: none;");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var bList = localStorage.getObj('badges');

    for (var i = 0; i < bList.length; i++) {

        var li = document.createElement("li");
        var name = bList[i].name;
        var points = bList[i].points;
        var progress = bList[i].progress;
        var descrip = bList[i].descrip;

        var TN = document.createElement('p');
        TN.innerHTML = name + ": " + progress;
        TN.setAttribute("style", "margin-bottom: 0%;");

        li.appendChild(TN);

        var TN = document.createElement('p');
        TN.innerHTML = descrip + " Worth " + points + " points.";
        TN.setAttribute("style", "margin-bottom: 0%;");

        li.appendChild(TN);

        ul.appendChild(li);
    }



}

function updateRewardsTable() {

    var ul = document.getElementById("rewardsHist");
	ul.setAttribute("style", "list-style-type: none;");

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var user = localStorage.getObj('user');

    var name = user[0].name;
    var lvl = user[0].lvl;
    var points = user[0].points;
    var li = document.createElement("li");

    var TN = document.createElement('p');
    TN.innerHTML = name + ": Level " + lvl;
    TN.setAttribute("style", "margin-bottom: 0%;");

    li.appendChild(TN);

    var TN = document.createElement('p');
    TN.innerHTML = points + "/100";
    TN.setAttribute("style", "margin-bottom: 0%;");

    li.appendChild(TN);

    var TN = document.createElement('p');
    TN.innerHTML = "Recent Points Earned:";
    TN.setAttribute("style", "margin-bottom: 0%;");

    li.appendChild(TN);

    ul.appendChild(li);

    var bList = localStorage.getObj('pointHist');
    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");

    var count = 0;

    for (var i = (bList.length - 1); i >= 0; i--) {

      if(curUser == bList[i].user){

        var li = document.createElement("li");
        var name = bList[i].name;
        var points = bList[i].points;

        var TN = document.createElement('p');
        TN.innerHTML = name + ": +" + points;
        TN.setAttribute("style", "margin-bottom: 0%;");

        li.appendChild(TN);

        ul.appendChild(li);

        count++;

        if (count >= 5) {
            break;
        }

    }
  }



}


function displayPgUpdate(ind) {
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
            if (bList[i].summary.length > 0) {
                bList[i].summary = bList[i].summary + "<br />" + sums;
            } else {
                bList[i].summary = sums;
            }
        }
    }

    localStorage.setObj('books', bList);
    updateBookLog();
    localStorage.setObj('sums', "");
}

function displaySummary(ind) {
    var bList = localStorage.getObj('books');
    var val = bList[ind].summary;
    if (val == "") {
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
    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");

    for (var i = 0; i < bList.length; i++) {
      if(curUser == bList[i].user){
        if (logForm[0] == bList[i].title) {
            if (logForm[2].length > 0) {
                bList[i].pgNumber = logForm[2];
            }
            if (logForm[3].length > 0) {
                var ts = parseFloat(bList[i].timeSpent) + parseFloat(logForm[3])
                bList[i].timeSpent = ts.toString();
            }
            bList[i].finished = logForm[4];
            if (bList[i].summary.length > 0) {
                bList[i].summary = bList[i].summary + "<br />" + logForm[5];
            } else {
                bList[i].summary = logForm[5];
            }
            existsFlag = true;
        }
      }
    }

    localStorage.setObj('books', bList);

    if (!existsFlag) {
        makeBook(logForm[0], logForm[1], logForm[2], logForm[3], logForm[4], logForm[5]);
    }

    updateBookLog();
    document.getElementById("form-log").reset();
    document.getElementById("summary-text").value = "";
    localStorage.setObj('sums', "");
    return false;

}


function makeBook(title, author, pgNumber, timeSpent, finished, summary, review) {
    var book = new Object();

    var username = localStorage.getItem('username');
    book.user = username.replace(/"/g,"");
    book.title = title;
    book.author = author;
    book.pgNumber = pgNumber;
    book.finished = finished;
    book.timeSpent = timeSpent;
    book.summary = summary;
    book.review = review;
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
    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");
    var username = localStorage.getItem('username');
    point.name = name;
    point.points = points;
    point.user = username.replace(/"/g,"");;

    var pList = localStorage.getObj('pointHist');
    pList.push(point);
    localStorage.setObj('pointHist', pList);

    var user = localStorage.getObj('user');

      for (var i = 0; i < user.length; i++) {
          if (curUser == user[i].name) {
            user[i].points = user[i].points + points;
            if (user[i].points >= 100) {
                user[i].points = user[i].points - 100;
                user[i].lvl = user[i].lvl + 1;
                popupReward("LEVEL UP");
            }
          }
      }


    localStorage.setObj('user', user);
}

function createUser(name, lvl, points, pw) {
    var user = new Object();
    user.name = name;
    user.lvl = lvl;
    user.points = points;
    user.pw = pw;

    var userList = localStorage.getObj('user');
    userList.push(user);
    localStorage.setObj('user', userList);
}


function signout() {
    localStorage.clear();
    window.open("login.html", "_top");

}
