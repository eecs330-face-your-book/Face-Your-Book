Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

function init() {
    var books = [];
    if (localStorage.getObj('books') === null) {
        localStorage.setObj('books', books);



        makeBook("Game of Thrones", "George R R Martin", "242", "6", true, ["test summary"]);
        makeBook("Ender's Game", "Orson Scott Card", "242", "1.5", false, []);



        localStorage.setObj('sums', "");
    }

    if (localStorage.getObj('pointHist') === null) {
        localStorage.setObj('pointHist', badges);
        localStorage.setObj('user', badges);

        createUser("FILL_ME_IN", 4, 0);

        addPoints("Read 25 pages", 20);
        addPoints("Start a new book", 25);
        addPoints("3-day streak", 10);

    }

    updateBookLog();

    loadDropdown();
    loadDropdown2();
    viewSummaries();

}


function loadDropdown() {
    var dd = document.getElementById("title-dropdown");
    var bList = localStorage.getObj('books');

    for (var i = (bList.length - 1); i >= 0; i--) {
        var o = document.createElement("option");
        o.setAttribute("value", bList[i].title);
        o.innerHTML = bList[i].title;
        dd.appendChild(o)
    }

}

function viewSummaries() {
    var bList = localStorage.getObj('books');
    var title = document.getElementById("title-dropdown-2").value;
    var sumArea = document.getElementById("last-summary-text");

    for (var i = 0; i < bList.length; i++) {
        if (title == bList[i].title) {
            var val = bList[i].summary;
            var sums = "";

            if (val.length == 0) {
                sums = "No summary listed";
				
            } else if (emptyStrings(val)) {
                sums = "No summary listed";
            } else {
                for (var i = 0; i < val.length; i++) {
                    sums += val[i];
                    sums += "\n";
                }

            }
            sumArea.innerHTML = sums;
        }
    }


}


function loadDropdown2() {
    var dd = document.getElementById("title-dropdown-2");
    var bList = localStorage.getObj('books');

    for (var i = (bList.length - 1); i >= 0; i--) {
        var o = document.createElement("option");
        o.setAttribute("value", bList[i].title);
        o.innerHTML = bList[i].title;
        dd.appendChild(o)
    }


}

function updateBookLog() {

    var ul = document.getElementById("bookLogList");

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var bList = localStorage.getObj('books');

    for (var i = (bList.length - 1); i >= 0; i--) {

        var li = document.createElement("li");
        var name = bList[i].title;

        var status = bList[i].pgNumber;
        var time = bList[i].timeSpent;
        var sumtext = bList[i].summary;
        var sum = document.createElement("button");
        sum.onclick = (function() {
            var curSum = i;
            return function() {
                displaySummary(curSum + '');
            }
        })();
        sum.setAttribute("style", "margin-top: 2%; margin-bottom: 2%;");
        sum.appendChild(document.createTextNode("Click to view summary."));
        if (bList[i].finished) {
            status = "Done"
        } else {
            status = "Page " + status;
        }
        var TN = document.createElement('p');
        TN.innerHTML = name + ": " + status + ", " + time + " hours";
        TN.setAttribute("style", "margin-bottom: 0%; text-decoration: underline; cursor: pointer;");
        TN.onclick = (function() {
            var curInd = i;
            return function() {
                displayPgUpdate(curInd + '');
            }
        })();

        li.appendChild(TN);
        li.appendChild(sum);
        ul.appendChild(li);
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
    var rev = document.getElementById("add-review-text2").value;
    var sums = localStorage.getObj('sums')

    var bList = localStorage.getObj('books');

    for (var i = 0; i < bList.length; i++) {
        if (title == bList[i].title) {
            bList[i].pgNumber = currPg;
            var ts = parseFloat(bList[i].timeSpent) + parseFloat(newTime);
            bList[i].timeSpent = ts.toString();
            bList[i].finished = fin;

            bList[i].summary.push(sums);
            var revs = bList[i].review;
            revs.push(rev);
            bList[i].review = revs;
            updateReviewLib(bList[i].title, rev);

        }
    }

    localStorage.setObj('books', bList);

    updateBookLog();
    document.getElementById("form-log").reset();
    localStorage.setObj('sums', "");
    document.getElementById("reviewbox2").style.display = "none";
}

function displaySummary(ind) {
    var bList = localStorage.getObj('books');
    var val = bList[ind].summary;
    var sums = "";
    if (val.length == 0) {
        sums = "No summary listed";
    } else if (emptyStrings(val)) {
        sums = "No summary listed";
    } else {
        for (var i = 0; i < val.length; i++) {
            sums += val[i];
            sums += "</br>";
        }
    }
    document.getElementById("sumdisplay-text").innerHTML = sums;
    document.getElementById("sum-display").style.display = "block";
}

function updateSummary() {
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
    var dd = document.getElementById("title-dropdown");
    var name = dd.value;

    var sums = document.getElementById("add-summary-text").value;
    var bList = localStorage.getObj('books');

    for (var i = 0; i < bList.length; i++) {
        if (name == bList[i].title) {
            bList[i].summary.push(sums);

        }
    }

    localStorage.setObj('books', bList);


    var msg = "Added a summary";
    addPoints(msg, 5);
    msg = msg + " +5"
    popupReward(msg);

    updateBookLog();
    document.getElementById("form-log").reset();
    localStorage.setObj('sums', "");
    viewSummaries();
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
    var popupList = document.getElementById("popupList");
    var popup = document.createElement("span");
    popup.setAttribute("class", "popuptext");
    popup.innerHTML = msg;
    popup.classList.toggle("show");
    popup.onclick = (function() {
        var popupElement = popup;
        return function() {
            popupElement.parentNode.removeChild(popupElement);
        }
    })();
    popupList.appendChild(popup);

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
    if (user[0].points >= 100) {
        user[0].points = user[0].points - 100;
        user[0].lvl = user[0].lvl + 1;
        popupReward("LEVEL UP");
    }
    localStorage.setObj('user', user);
}

function signout() {
    localStorage.clear();
    window.open("login.html", "_top");

}

function validatePg2() {
    var pg = document.getElementById("curr_pg_new").value;
    var num = parseInt(pg);
    console.log("here");
    if (isNaN(num)) {
        var errBox = document.getElementById("pg_error2");
        errBox.innerHTML = " Please only enter numbers";
    } else {
        document.getElementById("pg_error2").innerHTML = "";
    }

}


function displayReview2() {
    console.log("changed");
    var cb = document.getElementById("finish_new").checked;

    if (cb) {
        document.getElementById("reviewbox2").style.display = "block";
    } else {
        document.getElementById("reviewbox2").style.display = "none";
    }
}

function updateReviewLib(title, review) {
    var bLib = localStorage.getObj('bookLib');

    for (var i = 0; i < bLib.length; i++) {
        if (bLib[i].title == title) {
            bLib[i].review = bLib[i].review + "</br>" + review;
        }
    }

    localStorage.setObj("bookLib", bLib);
}

function validateTime2() {
    var pg = document.getElementById("time_spent_new").value;
    var num = parseInt(pg);
    if (isNaN(num)) {
        var errBox = document.getElementById("time_error2");
        errBox.innerHTML = " Please only enter numbers";
    } else {
        document.getElementById("time_error2").innerHTML = "";
    }

}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function emptyStrings(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != "") {
            return false;
        }
    }
    return true;
}


